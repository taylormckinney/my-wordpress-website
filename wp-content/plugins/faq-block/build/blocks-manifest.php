<?php
// This file is generated. Do not modify it manually.
return array(
	'faq-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'faq-plugin/faq-block',
		'version' => '0.1.0',
		'title' => 'Faq Block',
		'category' => 'widgets',
		'icon' => 'info',
		'description' => 'Block used for displaying a list of frequently asked questions, stylized as div objects.',
		'example' => array(
			
		),
		'supports' => array(
			'html' => false,
			'align' => true
		),
		'textdomain' => 'faq-block',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'attributes' => array(
			'faqList' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'question' => array(
							'type' => 'string',
							'default' => ''
						),
						'answer' => array(
							'type' => 'string',
							'default' => ''
						)
					)
				)
			)
		)
	)
);
