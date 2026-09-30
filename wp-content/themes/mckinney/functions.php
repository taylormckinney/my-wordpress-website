<?php 

add_action( 'wp_enqueue_scripts', function () {
    if ( ! wp_style_is( 'global-styles', 'registered' ) ) {
        wp_register_style( 'global-styles', false, array( 'wp-block-library' ) );
    }
}, 0 );
/* add_action( 'wp_enqueue_scripts', 'mckinney_enqueue_styles' );

function mckinney_enqueue_styles() {
	wp_enqueue_style( 
		'mckinney-style', 
		get_stylesheet_uri()
	);
}

 */