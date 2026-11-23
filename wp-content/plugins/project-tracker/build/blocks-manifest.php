<?php
// This file is generated. Do not modify it manually.
return array(
	'projects-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'project-tracker/projects-block',
		'version' => '0.1.0',
		'title' => 'Projects Block',
		'category' => 'widgets',
		'icon' => 'hammer',
		'description' => 'Projects Block for tracking and displaying projects.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'project-tracker',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'tasks-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'project-tracker/tasks-block',
		'version' => '0.1.0',
		'title' => 'Tasks Block',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Block to track current to-do items for projects.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'project-tracker',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
