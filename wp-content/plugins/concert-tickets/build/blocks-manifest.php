<?php
// This file is generated. Do not modify it manually.
return array(
	'setlist-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'concert-tickets/setlist-block',
		'version' => '0.1.0',
		'title' => 'Setlist Block',
		'category' => 'widgets',
		'icon' => 'tickets-alt',
		'description' => 'Used to create new \'Tickets\' using data from Setlist.fm API. Starts with User input',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'concert-tickets',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'tickets-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'concert-tickets/tickets-block',
		'version' => '0.1.0',
		'title' => 'Tickets Display Block',
		'category' => 'widgets',
		'icon' => 'tickets',
		'description' => 'Displays CPT \'Tickets\' which are generated from concert form submissions.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'concert-tickets',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	)
);
