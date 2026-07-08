<?php
    $block_props = get_block_wrapper_attributes(); 
    $skills_list = $attributes['skillsList'];
?>

<div <?php echo $block_props; ?>>
    <?php foreach ($skills_list as $skill): ?>
    
        <div class="skill-item">
            <span class="skill-name"><?php echo esc_html($skill); ?></span>
    </div>
    <?php endforeach; ?>
</div>