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

function tickets_block_enqueue_script () {
	wp_enqueue_script(
		'ajax_call',
		plugins_url() . '/tickets-block/src/tickets-block/ajaxCall.js',
		array('jquery')
	);

	wp_localize_script(
		'ajax_call',
		'ajax_object',
		array (
			'ajax_url' => admin_url('admin-ajax.php'),
			'nonce' => wp_create_nonce('ajax_nonce')
		)
	);
}

add_action('wp_enqueue_scripts', 'tickets_block_enqueue_script');

function get_setlist_ajax($setlist_search_url) {
	check_ajax_referer('ajax_nonce', 'security');
	$api_key = SETLISTFM_API_KEY; 
	$args = array(
		'headers' => array(
			'x-api-key' => $api_key,
			'Accept' => 'application/json',
		)
	);
	$response = wp_remote_get($url, $args);

	if(is_wp_error($response)) {
		wp_send_json_error(array('message' => 'Error fetching data from Setlist.fm API', 'error' => $response->get_error_message()));
	}
	wp_send_json_success(wp_remote_retrieve_body($response));

}

add_action('wp_ajax_nopriv_get_api_data', 'get_setlist_ajax');
add_action('wp_ajax_get_api_data', 'get_setlist_ajax');