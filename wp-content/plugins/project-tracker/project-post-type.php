<?php
/**
 * Plugin Name:       Projects Custom Post Type
 * Description:       Projects Custom Post Type for tracking and displaying projects.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       project-tracker
 *
 * @package ProjectTracker
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action('init', 'register_project_post_type');
/**
 * Registers 'Project' custom post type.
 * @return void
 */
function register_project_post_type() {
	register_post_type( 'project', array(
		'labels' => array(
			'name' => __( 'Projects', 'project-tracker' ),
			'singular_name' => __( 'Project', 'project-tracker' ),
		),
		'public' => true,
		'has_archive' => true,
		'supports' => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
		'rewrite' => array( 'slug' => 'projects' ),
		'menu_icon' => 'dashicons-hammer',
	) );
}

add_action('init', 'register_projects_taxonomies');

/**
 * Registers 'Project' custom taxonomies.
 * @return void
 */
function register_projects_taxonomies() {
    $categoryArgs = array(
		'labels' => array(
			'name' => __( 'Project Categories', 'project-tracker' ),
			'singular_name' => __( 'Project Category', 'project-tracker' ),
		),
		'public' => true,
		'hierarchical' => true,
        'show_in_rest' => true,
        
	);
	register_taxonomy( 'project_category', 'project', $categoryArgs );

    $statusArgs = array(
		'labels' => array(
			'name' => __( 'Project Statuses', 'project-tracker' ),
			'singular_name' => __( 'Project Status', 'project-tracker' ),
		),
		'public' => true,
		'hierarchical' => false,
	);
	register_taxonomy( 'project_status', 'project', $statusArgs );
}