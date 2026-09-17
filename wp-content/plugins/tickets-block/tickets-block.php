<?php
/**
 * Plugin Name:       Tickets Block
 * Description:       Displays a list of concerts as a ticket.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            Taylor McKinney
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       tickets-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
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
function create_block_tickets_block_block_init() {
	wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
}
add_action( 'init', 'create_block_tickets_block_block_init' );


/**
 * AJAX handler for processing concert search submissions 
 */ 
add_action('wp_ajax_nopriv_tickets_process_submission', 'tickets_process_submission');
add_action('wp_ajax_tickets_process_submission', 'tickets_process_submission');
function tickets_process_submission() {
    check_ajax_referer('tickets_process_submission', 'nonce');

    $artist = sanitize_text_field($_POST['artist']);
    $date = sanitize_text_field($_POST['date']);
    $city = sanitize_text_field($_POST['venue_city']);

    $errors = array();
    //TODO: validate inputs!!!!!
    if(!empty($errors)) {
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
    if(is_wp_error($apiResponse) || $statusCode !== 200) {
        wp_send_json_error( $responseBody);
    } else {
        $data = json_decode($responseBody);
        wp_send_json_success($data); //send back to JS
		
    }

    wp_die(); //terminates AJAX handler properly
}

add_action('wp_enqueue_scripts', 'ajax_tickets_enqueue_scripts');
function ajax_tickets_enqueue_scripts() {
    wp_enqueue_script('tickets-block-form', plugin_dir_url(__FILE__) . 'tickets-form-submission.js', array('jquery'), null, true);
    wp_localize_script('tickets-block-form', 'tickets_form_data', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('tickets_process_submission')
    ));
}

?>