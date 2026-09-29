<?php
/**
 * Title: Single Ticket
 * Slug: mckinney/single-ticket
 * Categories: posts
 * Post Types: ticket
 */
?>

<!-- wp:template-part {"slug": "header", "tagName": "header"} /-->

<?php
if( have_posts() ):
	while ( have_posts() ) : the_post();
		the_title();
		the_content();
		the_post_navigation();
	endwhile;
endif;
?>
<!-- wp:template-part {"slug": "footer"} /-->
