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
if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

add_action('init', 'register_project_post_type');
/**
 * Registers 'Project' custom post type.
 * @return void
 */
function register_project_post_type()
{
	register_post_type('project', array(
		'labels' => array(
			'name' => __('Projects', 'project-tracker'),
			'singular_name' => __('Project', 'project-tracker'),
			'add_new' => __('Add New Project', 'project-tracker'),
			'add_new_item' => __('Add New Project', 'project-tracker'),
			'edit_item' => __('Edit Project', 'project-tracker'),
			'new_item' => __('New Project', 'project-tracker'),
			'view_item' => __('View Project', 'project-tracker'),
			'search_items' => __('Search Projects', 'project-tracker'),
			'not_found' => __('No projects found', 'project-tracker'),
			'not_found_in_trash' => __('No projects found in Trash', 'project-tracker'),
		),
		'public' => true,
		'has_archive' => true,
		'show_in_rest' => true,
		'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
		'rewrite' => array('slug' => 'projects'),
		'menu_icon' => 'dashicons-hammer',
		'template' => array(
			array(
				'core/heading',
				array(
					'level' => 2,
					'content' => __('Description', 'project-tracker'),
				)
			),
			array(
				'core/paragraph',
				array(
					'placeholder' => __('Describe the project...', 'project-tracker'),
				)
			),
			array(
				'core/heading',
				array(
					'level' => 2,
					'content' => __('Notes', 'project-tracker'),
				)
			),
			array(
				'core/paragraph',
				array(
					'placeholder' => __('Add notes...', 'project-tracker'),
				)
			),
			array(
				'core/heading',
				array(
					'level' => 2,
					'content' => __('To-Do', 'project-tracker'),
				)
			),
			array(
				'project-tracker/tasks-block',
				array(),
			),
			array(
				'core/heading',
				array(
					'level' => 2,
					'content' => __('Relevant Skills', 'project-tracker'),
				)
			),
			array(
				'skills-plugin/skills-block',
				array(
					'skillsList' => array('Relevant Skills here'),
				)
			),
			array(
				'core/paragraph',
				array(),
			),
		),
	));
}

add_action('init', 'register_projects_taxonomies');

/**
 * Registers 'Project' custom taxonomies.
 * @return void
 */
function register_projects_taxonomies()
{
	$categoryArgs = array(
		'labels' => array(
			'name' => __('Project Category', 'project-tracker'),
			'singular_name' => __('Project Category', 'project-tracker'),
			'plural_name' => __('Project Categories', 'project-tracker'),
		),
		'public' => true,
		'hierarchical' => true,
		'show_in_rest' => true,
		'show_ui' => true,

	);
	register_taxonomy('project_category', 'project', $categoryArgs);

	$statusArgs = array(
		'labels' => array(
			'name' => __('Project Status', 'project-tracker'),
			'singular_name' => __('Project Status', 'project-tracker'),
			'plural_name' => __('Project Statuses', 'project-tracker'),
		),
		'public' => true,
		'hierarchical' => false,
		'show_in_rest' => true,
		'show_ui' => true,
	);
	register_taxonomy('project_status', 'project', $statusArgs);
}

add_action('init', 'register_projects_meta');
function register_projects_meta()
{
	register_meta(
		'post',
		'skills',
		array(
			'type' => 'array',
			'single' => true,
			'show_in_rest' => array(
				'schema' => array(
					'type' => 'array',
					'items' => array(
						'type' => 'string',
					),
				),
			),
			'object_subtype' => 'project'
		)
	);

	register_meta(
		'post',
		'completed_date',
		array(
			'type' => 'string',
			'default' => '',
			'single' => true,
			'show_in_rest' => true,
			'object_subtype' => 'project'
		)
	);
}