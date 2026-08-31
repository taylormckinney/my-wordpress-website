<?php
// This file is generated. Do not modify it manually.
return array(
	'tickets-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'concerts/tickets-block',
		'version' => '0.1.0',
		'title' => 'Tickets Block',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Displays a list of concerts as a ticket.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'tickets-block',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'attributes' => array(
			'concertsList' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'date' => array(
							'type' => 'string',
							'default' => ''
						),
						'artist' => array(
							'type' => 'string',
							'default' => ''
						),
						'venue' => array(
							'type' => 'object',
							'properties' => array(
								'name' => array(
									'type' => 'string',
									'default' => ''
								),
								'city' => array(
									'type' => 'string',
									'default' => ''
								),
								'state' => array(
									'type' => 'string',
									'default' => ''
								)
							)
						),
						'seatDetails' => array(
							'type' => 'object',
							'properties' => array(
								'section' => array(
									'type' => 'string',
									'default' => ''
								),
								'row' => array(
									'type' => 'string',
									'default' => ''
								),
								'seatNumber' => array(
									'type' => 'string',
									'default' => ''
								)
							)
						)
					)
				)
			)
		)
	)
);
