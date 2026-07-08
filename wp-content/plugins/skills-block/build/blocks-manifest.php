<?php
// This file is generated. Do not modify it manually.
return array(
	'skills-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'skills-plugin/skills-block',
		'version' => '0.1.0',
		'title' => 'Skills Block',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Example block scaffolded with Create Block tool.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'skills-block',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'attributes' => array(
			'skillsList' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'string',
					'default' => ''
				)
			)
		)
	)
);
