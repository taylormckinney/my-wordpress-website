<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$display_mode = $attributes['displayMode'] ?? 'list';
$queryParams = $attributes['queryOptions'] ?? array();
$queryParams['post_type'] = 'ticket';

$filter_taxonomy = sanitize_key($attributes['filterTaxonomy'] ?? '');
$filter_term_id = absint($attributes['filterTermId'] ?? 0);



?>
<div <?php echo get_block_wrapper_attributes(); ?>
	style="background-color: <?php echo $attributes['backgroundColor'] ?>">

	<?php
	//conditionally add query params, otherwise defaults to listing all 'tickets' 
	if ($display_mode === 'single') {
		$ticket_id = absint($attributes['ticketId'] ?? 0); //normalizes to integer, if attribute is empty, defaults to 0
		//default to ticket ID from block attributes (user selection in editor), but if empty, use the post ID (displaying on single 'ticket')
		if (!$ticket_id) {
			$ticket_id = absint($block->context['postId'] ?? 0);
			//if still empty, default to 0
		}
		$queryParams['p'] = $ticket_id;
	} else if ($display_mode === 'archive') {
		//if block is being displayed as taxonomy page:
		if (is_tax()) {
			$current_term = get_queried_object();
			if ($current_term instanceof WP_Term && is_object_in_taxonomy('ticket', $current_term->taxonomy)) {
				$queryParams['tax_query'] = array(
					array(
						'taxonomy' => $current_term->taxonomy,
						'field' => 'term_id',
						'terms' => $current_term->term_id,
					),
				);

			}
			//if archive was selected/set in site editor (using attributes)
			else if ($filter_term_id && is_object_in_taxonomy('ticket', $filter_taxonomy)) {
				$queryParams['tax_query'] = array(
					array(
						'taxonomy' => $filter_taxonomy,
						'field' => 'term_id',
						'terms' => $filter_term_id,
					),
				);
			} else {
				error_log('Invalid ticket taxonomy filter. Taxonomy: ' . $filter_taxonomy . ' Term ID: ' . $filter_term_id);
			}
		}
	}


	$query = new WP_query($queryParams);

	if ($query->have_posts()) {
		while ($query->have_posts()) {
			$query->the_post();
			$tour_name = get_post_meta(get_the_ID(), 'tour_name', true);
			$opener_names = get_post_meta(get_the_ID(), 'opener', false);
			$opener_names = array_filter($opener_names, function ($opener_name) {
				return is_string($opener_name) && trim($opener_name) !== '';
			});
			?>
			<div class="ticket" id="<?php echo the_ID(); ?>">
				<div class="ticket__details">
					<h3 class="ticket__title">
						<a href="<?php echo the_permalink(); ?>" id="link<?php echo the_ID(); ?>">
							<?php echo get_the_terms(get_the_ID(), 'artist')[0]->name; ?>
						</a>
					</h3>
					<h4><?php echo get_post_meta(get_the_ID(), 'pretty_date', true); ?></h4>
					<ul>
						<li>Venue: <?php echo get_the_terms(get_the_ID(), 'venue')[0]->name; ?></li>
						<li>Location: <?php echo get_post_meta(get_the_ID(), 'city', true); ?>,
							<?php echo get_post_meta(get_the_ID(), 'state', true); ?>
						</li>
						<?php if (is_string($tour_name) && trim($tour_name) !== '') { ?>
							<li>Tour: <?php echo esc_html($tour_name); ?></li>
						<?php }
						if (!empty($opener_names)) { ?>
							<li>Opening Acts: <?php echo esc_html(implode(', ', $opener_names)); ?></li>
						<?php } ?>
					</ul>
				</div>
				<div class="ticket__rip"></div>
				<div class="ticket__seats">
					<?php $section = get_post_meta(get_the_ID(), 'seat_section', true);
					if ($section == 'General Admission') {
						?>
						<span class="heading">General Admission</span>
						<span class="seatInfo">GA</span>
					<?php } else {
						?>
						<span class="heading">Section</span>
						<span class="seatInfo"><?php echo $section; ?></span>
						<span class="heading">Row</span>
						<span class="seatInfo"><?php echo get_post_meta(get_the_ID(), 'seat_row', true); ?></span>
						<span class="heading">Seat Number</span>
						<span class="seatInfo"><?php echo get_post_meta(get_the_ID(), 'seat_number', true); ?></span>
					<?php } ?>
				</div>
			</div>
			<?php
		}
		wp_reset_postdata();
	} //ends if ($query->have_posts())
	?>



</div>