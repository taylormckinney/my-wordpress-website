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
    );

    register_post_type('tickets', $args);
}
?>