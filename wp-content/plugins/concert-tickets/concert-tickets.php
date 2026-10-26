<?php
/**
 * Plugin Name:       Concert Tickets
 * Description:       Displays a list of concerts as a ticket.
 * Version:           0.1.0
 * Requires at least: 6.9
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

	$artist = isset($_POST['artist']) ? sanitize_text_field($_POST['artist']) : '';
	$date = isset($_POST['date']) ? sanitize_text_field($_POST['date']) : '';
	$city = isset($_POST['venue_city']) ? sanitize_text_field($_POST['venue_city']) : '';
    //used for searching for openers: 
	$venue_id = isset($_POST['venue_id']) ? sanitize_text_field($_POST['venue_id']) : '';
	
	//TODO: add validation for input fields, if needed
	$errors = array();
	if (!empty($errors)) {
		wp_send_json_error(implode(', ', $errors)); //if errors in input, send back to JS 
	}

	$searchURL = 'https://api.setlist.fm/rest/1.0/search/setlists?';
	
	if (!empty($artist)){
		$searchURL .= '&artistName=' . urlencode($artist);
	}
	if (!empty($date)) {
		$searchURL .= '&date=' . urlencode($date);
	}
	if (!empty($city)) {
		$searchURL .= '&cityName=' . urlencode($city);
	}
	if (!empty($venue_id)) {
		$searchURL .= '&venueId=' . urlencode($venue_id);
	}

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

function renderSetlistContent($data) {
	// Normalize the sets structure. Setlist.fm returns sets => ['set' => [ ... ]]
	$setlist = array();
	if (isset($data['sets'])) {
		if (isset($data['sets']['set']) && is_array($data['sets']['set'])) {
			$setlist = $data['sets']['set'];
		} elseif (is_array($data['sets'])) {
			$setlist = $data['sets'];
		}
	}
	$content = '';
	foreach ($setlist as $set) {
		$set_name = is_array($set) && isset($set['name']) ? $set['name'] : (is_array($set) && isset($set['encore']) ? 'Encore' : '');
		$heading_html = '<h2 class="wp-block-heading concert-heading">' . esc_html($set_name) . '</h2>';
		$content .= get_comment_delimited_block_content('core/heading', array('level' => 2), $heading_html);
		$list_items = array();

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
			$song_extras = [];
			if (is_array($s) && isset($s['name'])) {
				$song_name = $s['name'];
				if (isset($s['info'])) {
					$song_extras['info'] = $s['info'];
				}
				if (isset($s['cover'])) {
					$song_extras['cover'] = $s['cover']['name'] . ' cover';
				}
				if (isset($s['with'])) {
					$song_extras['with'] = 'with ' . $s['with']['name'];
				}
			} elseif (is_string($s)) {
				$song_name = $s;
			}

			if (!empty($song_extras)) {
				$list_item_html = '<li>' . esc_html($song_name) . ' <span class="info"> <small>(' . implode(', ', array_map('esc_html', $song_extras)) . ')</small></span></li>';
			} else {
				$list_item_html = '<li>' . esc_html($song_name) . '</li>';
			}
			$list_items[] = get_comment_delimited_block_content('core/list-item', array(), $list_item_html);

		}

		$list_html = '<ul class="wp-block-list">' . implode('', $list_items) . '</ul>';
		$content .= get_comment_delimited_block_content('core/list', array(), $list_html);
	}

	return $content;
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
	
	

	$content = '';
	if(isset($show_data['info']) && !empty($show_data['info'])) {
		$info_html = '<p><span class="info">' . esc_html($show_data['info']) . '</span></p>';
		$content .= get_comment_delimited_block_content('core/paragraph', array(), $info_html);
	}
	$content .= renderSetlistContent($show_data);

	
	//for creating human-readable date
	$date = date_create($show_data['eventDate']);
	$pretty_date = date_format($date, 'F j, Y');

	$meta_input = array(
		'pretty_date' => $pretty_date,
		'date' => sanitize_text_field($show_data['eventDate']),
		'state' => sanitize_text_field($show_data['venue']['city']['state']),
		'city' => sanitize_text_field($show_data['venue']['city']['name']),
		'tour_name' => sanitize_text_field($show_data['tour']['name'] ?? ''),
	);
	//only add/update seat info if value is provided in show data & existing ticket does not already have seat info
	$seat_data = isset($show_data['seat']) && is_array($show_data['seat']) ? $show_data['seat'] : array();
	foreach (array(
		'section' => 'seat_section',
		'row' => 'seat_row',
		'number' => 'seat_number',
	) as $seat_field => $meta_key) {
		if (isset($seat_data[$seat_field]) && is_scalar($seat_data[$seat_field])) {
			$seat_value = sanitize_text_field((string) $seat_data[$seat_field]);
			if ($seat_value !== '') {
				$meta_input[$meta_key] = $seat_value;
			}
		}
	}

	//normalize/process openers data for storage in post meta or storing setlist: 
	$opener_names = array();
	$opener_setlists = array();
	if (isset($show_data['openers']) && is_array($show_data['openers'])) {
		foreach ($show_data['openers'] as $opener) {
			if (!is_array($opener) || !isset($opener['name']) || !is_scalar($opener['name'])) {
				continue;
			}

			$opener_name = sanitize_text_field((string) $opener['name']);
			if ($opener_name === '') {
				continue;
			}

			$opener_names[] = $opener_name;
			if (isset($opener['setlist']) && is_array($opener['setlist'])) {
				$opener_setlists[] = array(
					'name' => $opener_name,
					'setlist' => $opener['setlist'],
				);
			}
		}
	}

	error_log('Opener names: ' . print_r($opener_names, true));
	error_log('Opener setlists: ' . print_r($opener_setlists, true));
	$accordion_items = array();
	foreach ($opener_setlists as $opener_setlist) {
		$setlist_content = renderSetlistContent($opener_setlist['setlist']);
		if ($setlist_content === '') {
			continue;
		}

		$heading_html = sprintf(
			'<h3 class="wp-block-accordion-heading has-icon has-icon-right"><button type="button" class="wp-block-accordion-heading__toggle"><span class="wp-block-accordion-heading__toggle-title">%s</span><span class="wp-block-accordion-heading__toggle-icon" aria-hidden="true">+</span></button></h3>',
			esc_html($opener_setlist['name'] . ' Setlist')
		);
		$heading_block = get_comment_delimited_block_content('core/accordion-heading', array(), $heading_html);
		$panel_html = '<div role="region" class="wp-block-accordion-panel">' . $setlist_content . '</div>';
		$panel_block = get_comment_delimited_block_content('core/accordion-panel', array(), $panel_html);
		$item_html = '<div class="wp-block-accordion-item">' . $heading_block . $panel_block . '</div>';
		$accordion_items[] = get_comment_delimited_block_content('core/accordion-item', array(), $item_html);
	}

	if (!empty($accordion_items)) {
		$accordion_html = '<div role="group" class="wp-block-accordion">' . implode('', $accordion_items) . '</div>';
		$content .= get_comment_delimited_block_content('core/accordion', array(), $accordion_html);
	}

	$ticket_data = array(
		'post_title' => $title = sanitize_text_field($show_data['artist']['name'] . ' - ' . $pretty_date),
		'post_excerpt' => $show_data['venue']['name'] . ', ' . $show_data['venue']['city']['name'],
		'post_content' => $content,
		'post_status' => 'publish',
		'post_type' => 'ticket',
		'tax_input' => array(
			'artist' => sanitize_text_field($show_data['artist']['name']),
			'venue' => sanitize_text_field($show_data['venue']['name']),
			'concert_month' => sanitize_text_field(date_format($date, 'F')),
			'concert_year' => sanitize_text_field(date_format($date, 'Y')),
			//'festival' => sanitize_text_field($show_data['eventDate']), //TODO: to be implemented after regular concerts
		),
		'meta_input' => $meta_input,
	);
	$post_id = post_exists($title);
	if ($post_id) { //update existing post
		$ticket_data["ID"] = $post_id;
	}
	$ticket_id = wp_insert_post($ticket_data);

	if (is_wp_error($ticket_id)) {
		wp_send_json_error('Error creating ticket.');
	}

	if (isset($show_data['openers']) && is_array($show_data['openers'])) {
		delete_post_meta($ticket_id, 'opener');
		foreach ($opener_names as $opener_name) {
			add_post_meta($ticket_id, 'opener', $opener_name);
		}
	}

	wp_send_json_success($ticket_id);

	wp_die();
}

add_action('wp_enqueue_scripts', 'ajax_tickets_enqueue_scripts');
function ajax_tickets_enqueue_scripts()
{
	// enqueue script to allow for import of Toastify in js file 
	$asset_file = plugin_dir_path(__FILE__) . 'build/form/tickets-form-submission.asset.php';
	$asset = require $asset_file;
	$dependencies = array_unique(array_merge($asset['dependencies'], array('jquery')));

	wp_enqueue_script(
		'tickets-block-form',
		plugin_dir_url(__FILE__) . 'build/form/tickets-form-submission.js',
		$dependencies,
		$asset['version'],
		true
	);
	
	wp_enqueue_style(
		'tickets-block-form',
		plugin_dir_url(__FILE__) . 'build/form/tickets-form-submission.css',
		array(),
		$asset['version']
	);
	wp_localize_script(
		'tickets-block-form',
		'tickets_ajax_data',
		array(
			'ajax_url' => admin_url('admin-ajax.php'),
			'form_nonce' => wp_create_nonce('tickets_process_submission'),
			'create_ticket_nonce' => wp_create_nonce('create_new_ticket'),
		)
	);

}
