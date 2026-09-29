<?php 
/**
 * Plugin Name: Tickets Post Type
 * Description: Registers a custom post type 'tickets' for use in concert/tickets block.
 * Version: 0.1.0
 * Requires at least: 6.8
 * Requires PHP: 7.4
 * Author: Taylor McKinney
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: tickets-post-type
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
            'name' => __('Tickets', 'tickets-post-type'),
            'singular_name' => __('Ticket', 'tickets-post-type'),
            'add_new' => __('Add New Ticket', 'tickets-post-type'),
            'add_new_item' => __('Add New Ticket', 'tickets-post-type'),
            'edit_item' => __('Edit Ticket', 'tickets-post-type'),
            'view_item' => __('View Ticket', 'tickets-post-type'),
            'view_items' => __('View Tickets', 'tickets-post-type'),
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
            'name' => __('Artists', 'tickets-post-type'),
            'singular_name' => __('Artist', 'tickets-post-type'),
        ),
        'public' => true,
        'hierarchical' => false,
        'show_in_rest' => true,
    );
    register_taxonomy('artist', 'ticket', $artistArgs);

    $venueArgs = array(
        'labels' => array(
            'name' => __('Venues', 'tickets-post-type'),
            'singular_name' => __('Venue', 'tickets-post-type'),
        ),
        'public' => true,
        'hierarchical' => false,
        'show_in_rest' => true,
    );
    register_taxonomy('venue', 'ticket', $venueArgs);

    $festivalArgs = array(
        'labels' => array(
            'name' => __('Festivals', 'tickets-post-type'),
            'singular_name' => __('Festival', 'tickets-post-type'),
        ),
        'public' => true,
        'hierarchical' => false,
        'show_in_rest' => true,
    );
    register_taxonomy('festival', 'ticket', $festivalArgs);
}

/**
 * Loads templates for 'ticket' post type. 
 */
/* add_filter('template_include', 'add_tickets_post_type_templates');
function add_tickets_post_type_templates ($template) {
    if (is_singular('ticket')) {
        $plugin_template = plugin_dir_path(__FILE__) . 'single-ticket.php';
        if(file_exists($plugin_template)) {
            return $plugin_template;
        }
    }

    if(is_post_type_archive('ticket')) {
        $plugin_template = plugin_dir_path(__FILE__) . 'archive-ticket.php';
        if(file_exists($plugin_template)) {
            return $plugin_template;
        }
    }

    return $template;
} */