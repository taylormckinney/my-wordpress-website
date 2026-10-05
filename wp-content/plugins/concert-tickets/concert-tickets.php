<?php
/**
 * Plugin Name:       Concert Tickets
 * Description:       Displays a list of concerts as a ticket.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            Taylor McKinney
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       concert-tickets
 *
 */

require_once plugin_dir_path(__FILE__) . '/tickets-post-type/tickets-post-type.php';

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}
/**
 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
 * based on the registered block metadata. Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function concerts_tickets_block_init()
{
	wp_register_block_types_from_metadata_collection(__DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php');
}
add_action('init', 'concerts_tickets_block_init');


/**
 * AJAX handler for processing concert search submissions 
 */
add_action('wp_ajax_tickets_process_submission', 'tickets_process_submission');
function tickets_process_submission()
{
	check_ajax_referer('tickets_process_submission', 'nonce');

	$artist = sanitize_text_field($_POST['artist']);
	$date = sanitize_text_field($_POST['date']);
	$city = sanitize_text_field($_POST['venue_city']);

	$errors = array();
	//TODO: validate inputs!!!!!
	if (!empty($errors)) {
		wp_send_json_error(implode(', ', $errors)); //if errors in input, send back to JS 
	}

	$setlistBaseUrl = 'https://api.setlist.fm/rest/1.0/search/setlists?';
	$searchURL = $setlistBaseUrl . 'artistName=' . urlencode($artist) . '&date=' . urlencode($date) . '&cityName=' . urlencode($city);

	$apiResponse = wp_remote_get($searchURL, array(
		'headers' => array(
			'x-api-key' => get_option('setlist_fm_api_key'), // Retrieve the API key from the WordPress options table
			'Accept' => 'application/json'
		)
	));

	$statusCode = wp_remote_retrieve_response_code($apiResponse);
	$responseBody = wp_remote_retrieve_body($apiResponse);

	if (is_wp_error($apiResponse) || $statusCode !== 200) {
		wp_send_json_error($responseBody);
	} else {
		$data = json_decode($responseBody);
		wp_send_json_success($data); //send back to JS

	}

	wp_die(); //terminates AJAX handler properly
}

add_action('wp_ajax_create_new_ticket', 'create_new_ticket');
function create_new_ticket()
{
	check_ajax_referer('create_new_ticket', 'nonce');
	//programatically create new ticket using show object 

	$show_data = isset($_POST['show']) ? json_decode(stripslashes($_POST['show']), true) : null;

	if (!is_array($show_data)) {
		wp_send_json_error('Invalid show payload.');
	}
	//error_log("show data: " . print_r($show_data, true));
	// Normalize the sets structure. Setlist.fm returns sets => ['set' => [ ... ]]
	$setlist = array();
	if (isset($show_data['sets'])) {
		if (isset($show_data['sets']['set']) && is_array($show_data['sets']['set'])) {
			$setlist = $show_data['sets']['set'];
		} elseif (is_array($show_data['sets'])) {
			$setlist = $show_data['sets'];
		}
	}

	$content = $show_data['info'] ?? "";

	foreach ($setlist as $set) {
		$set_name = is_array($set) && isset($set['name']) ? $set['name'] : (is_array($set) && isset($set['encore']) ? 'Encore' : '');
		$content .= '<h3>' . esc_html($set_name) . '</h3>';
		$content .= '<ul>';

		// Normalize songs: Setlist.fm returns songs under ['song'] which may be
		// a numeric array or a single associative array.
		$songs = array();
		if (isset($set['song'])) {
			if (is_array($set['song']) && isset($set['song'][0])) {
				$songs = $set['song'];
			} else {
				$songs = array($set['song']);
			}
		}

		foreach ($songs as $s) {
			$song_name = '';
			if (is_array($s) && isset($s['name'])) {
				$song_name = $s['name'];
			} elseif (is_string($s)) {
				$song_name = $s;
			}
			$content .= '<li>' . esc_html($song_name) . '</li>';
		}

		$content .= '</ul>';
	}


	$ticket_data = array(
		'post_title' => $title = sanitize_text_field($show_data['artist']['name'] . ' - ' . $show_data['eventDate']),
		'post_excerpt' => $show_data['venue']['name'] . ', ' . $show_data['venue']['city']['name'],
		'post_content' => $content,
		'post_status' => 'publish',
		'post_type' => 'ticket',
		'tax_input' => array(
			'artist' => sanitize_text_field($show_data['artist']['name']),
			'venue' => sanitize_text_field($show_data['venue']['name']),
			//'festival' => sanitize_text_field($show_data['eventDate']), //to be implemented after regular concerts
		),
		'meta_input' => array(
			'date' => sanitize_text_field($show_data['eventDate']),
			'state' => sanitize_text_field($show_data['venue']['city']['state']),
			'city' => sanitize_text_field($show_data['venue']['city']['name']),
			'tour_name' => sanitize_text_field($show_data['tour']['name'] ?? ''),
			'seat_section' => sanitize_text_field($show_data['seat']['section']),
			'seat_row' => sanitize_text_field($show_data['seat']['row'] ?? ''),
			'seat_number' => sanitize_text_field($show_data['seat']['number'] ?? ''),
		),
	);
	$post_id = post_exists($title);
	if ($post_id) { //update existing post
		$ticket_data["ID"] = $post_id;
	}
	$ticket_id = wp_insert_post($ticket_data);

	if (is_wp_error($ticket_id)) {
		wp_send_json_error('Error creating ticket.');
	}

	wp_send_json_success($ticket_id);

	wp_die();
}

add_action('wp_enqueue_scripts', 'ajax_tickets_enqueue_scripts');
function ajax_tickets_enqueue_scripts()
{
	wp_enqueue_script(
		'tickets-block-form',
		plugin_dir_url(__FILE__) . 'tickets-form-submission.js',
		array('jquery'),
		null,
		true
	);
	wp_localize_script(
		'tickets-block-form',
		'tickets_ajax_data',
		array(
			'ajax_url' => admin_url('admin-ajax.php'),
			'form_nonce' => wp_create_nonce('tickets_process_submission'),
			'create_ticket_nonce' => wp_create_nonce('create_new_ticket')
		)
	);

}

