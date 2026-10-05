<?php 
/**
 * Plugin Name: Concert Tickets
 * Description: Registers a custom post type 'tickets' for use in concert/tickets block.
 * Version: 0.1.0
 * Requires at least: 6.8
 * Requires PHP: 7.4
 * Author: Taylor McKinney
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: concert-tickets
 */


if(!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Registers the 'tickets' custom post type.
 */
add_action('init', 'register_tickets_post_type');
function register_tickets_post_type() {
    $args = array(
        'labels' => array(
            'name' => __('Tickets', 'concert-tickets'),
            'singular_name' => __('Ticket', 'concert-tickets'),
            'add_new' => __('Add New Ticket', 'concert-tickets'),
            'add_new_item' => __('Add New Ticket', 'concert-tickets'),
            'edit_item' => __('Edit Ticket', 'concert-tickets'),
            'view_item' => __('View Ticket', 'concert-tickets'),
            'view_items' => __('View Tickets', 'concert-tickets'),
        ),
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'rewrite' => array('slug' => 'tickets'),
        'menu_icon' => 'dashicons-tickets-alt',
    );

    register_post_type('ticket', $args);
}

/**
 * Register custom post meta for 'ticket' type
 */
add_action('init', 'register_tickets_meta');
function register_tickets_meta() {
   register_meta(
    'post',
    'date',
    array(
        'type' => 'string',
        'default' => '',
        'single' => true,
        'show_in_rest' => true,
        'object_subtype' => 'ticket'
    ));

    register_meta(
    'post',
    'state',
    array(
        'type' => 'string',
        'default' => '',
        'single' => true,
        'show_in_rest' => true,
        'object_subtype' => 'ticket'
    ));

    register_meta(
    'post',
    'city',
    array(
        'type' => 'string',
        'default' => '',
        'single' => true,
        'show_in_rest' => true,
        'object_subtype' => 'ticket'
    ));

    register_meta(
    'post',
    'tour-name',
    array(
        'label' => 'Tour Name',
        'type' => 'string',
        'default' => '',
        'single' => true,
        'show_in_rest' => true,
        'object_subtype' => 'ticket'
    ));

    register_meta(
    'post',
    'seat_section',
    array(
        'label' => 'Seat Section',
        'type' => 'string',
        'default' => '',
        'single' => true,
        'show_in_rest' => true,
        'object_subtype' => 'ticket'
    ));

    register_meta(
    'post',
    'seat_row',
    array(
        'label' => 'Seat Row',
        'type' => 'string',
        'default' => '',
        'single' => true,
        'show_in_rest' => true,
        'object_subtype' => 'ticket'
    ));

    register_meta(
    'post',
    'seat_number',
    array(
        'label' => 'Seat Number',
        'type' => 'string',
        'default' => '',
        'single' => true,
        'show_in_rest' => true,
        'object_subtype' => 'ticket'
    ));
}

/**
 * Adds custom meta keys for the 'ticket' post type.
 */
add_filter('postmeta_form_keys', 'add_tickets_post_type_meta_keys', 10, 2);
function add_tickets_post_type_meta_keys($keys, $post) {
    if ( $post->post_type === 'ticket' ) {
        $keys[] = 'date';
        $keys[] = 'state';
        $keys[] = 'city';
        $keys[] = 'tour_name';
        $keys[] = 'seat_section';
        $keys[] = 'seat_row';
        $keys[] = 'seat_number';
    }
    return $keys;
}

/**
 * Registers custom taxonomies for the 'ticket' post type. ('artist', 'venue', 'festival')
 */
add_action('init', 'register_tickets_taxonomies');
function register_tickets_taxonomies() {
    $artistArgs = array(
        'labels' => array(
            'name' => __('Artists', 'concert-tickets'),
            'singular_name' => __('Artist', 'concert-tickets'),
        ),
        'public' => true,
        'hierarchical' => false,
        'show_in_rest' => true,
    );
    register_taxonomy('artist', 'ticket', $artistArgs);

    $venueArgs = array(
        'labels' => array(
            'name' => __('Venues', 'concert-tickets'),
            'singular_name' => __('Venue', 'concert-tickets'),
        ),
        'public' => true,
        'hierarchical' => false,
        'show_in_rest' => true,
    );
    register_taxonomy('venue', 'ticket', $venueArgs);

    $festivalArgs = array(
        'labels' => array(
            'name' => __('Festivals', 'concert-tickets'),
            'singular_name' => __('Festival', 'concert-tickets'),
        ),
        'public' => true,
        'hierarchical' => false,
        'show_in_rest' => true,
    );
    register_taxonomy('festival', 'ticket', $festivalArgs);
}

