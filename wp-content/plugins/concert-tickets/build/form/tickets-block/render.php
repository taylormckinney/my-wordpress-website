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
?>
<div <?php echo get_block_wrapper_attributes(); ?>>

	<?php
	if ($display_mode === 'single') {
		$ticket_id = $attributes['ticketId'] ?? $block->context['postId'];
		//default to ticket ID from block attributes, but if empty, use the post ID
		//TODO: Implement single ticket display logic
	} else {
		$query = new WP_query(array('post_type' => 'ticket'));

		if ($query->have_posts()) {
			while ($query->have_posts()) {
				$query->the_post();
				?>
				<div class="ticket" id="<?php echo the_ID(); ?>">
					<div class="ticket__details">
						<h3 class="ticket__title">
							<a href="<?php echo the_permalink(); ?>" id="link<?php echo the_ID(); ?>">
								<?php echo get_the_terms(get_the_ID(), 'artist')[0]->name; ?>
							</a>
						</h3>
						<h4><?php echo get_post_meta(get_the_ID(), 'date', true); ?></h4>
						<ul>
							<li>Venue: <?php echo get_the_terms(get_the_ID(), 'venue')[0]->name; ?></li>
							<li>Location: <?php echo get_post_meta(get_the_ID(), 'city', true); ?>,
								<?php echo get_post_meta(get_the_ID(), 'state', true); ?>
							</li>
							<li>Tour: <?php echo get_post_meta(get_the_ID(), 'tour_name', true); ?></li>
						</ul>
					</div>
					<div class="ticket__rip"></div>
					<div class="ticket__seats">
						<?php $section = get_post_meta(get_the_ID(), 'seat_section', true);
						if ($section == 'General Admission') {
							?>
							<span class="seatInfo">General Admission</span>
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
				//TODO: account for gen admission tickets with no seat info
			}
			wp_reset_postdata();
		}
		?>



	</div>

<?php } ?>