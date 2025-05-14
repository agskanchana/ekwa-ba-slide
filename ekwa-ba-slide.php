<?php
/**
 * Plugin Name: EKWA Before-After Slider
 * Description: A premium before-after image comparison slider with Gutenberg block.
 * Version: 1.0.0
 * Author: EKWA
 * Text Domain: ekwa-ba-slide
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

require 'includes/plugin-update-checker/plugin-update-checker.php';
use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

$myUpdateChecker = PucFactory::buildUpdateChecker(
	'https://github.com/agskanchana/ekwa-ba-slide/',
	__FILE__,
	'ekwa-ba-slide'
);



// Define plugin constants
define('EKWA_BA_SLIDE_VERSION', '1.0.0');
define('EKWA_BA_SLIDE_PATH', plugin_dir_path(__FILE__));
define('EKWA_BA_SLIDE_URL', plugin_dir_url(__FILE__));

/**
 * Conditionally enqueue frontend scripts and styles
 * Only loads when the block is present on the page
 */
function ekwa_ba_slide_enqueue_assets() {
    // Don't enqueue anything by default
    // Assets will be loaded only if the block is detected
}
add_action('wp_enqueue_scripts', 'ekwa_ba_slide_enqueue_assets');

/**
 * Check if the block is used in the current post/page
 */
function ekwa_ba_slide_has_block() {
    if (!is_singular()) {
        return false;
    }

    $post = get_post();
    return $post && has_block('ekwa/ba-slider', $post);
}

/**
 * Register block assets
 */
function ekwa_ba_slide_register_block_assets() {
    // Register assets (doesn't enqueue them yet)
    wp_register_style(
        'ekwa-ba-slide-style',
        EKWA_BA_SLIDE_URL . 'assets/css/ekwa-slider.css',
        array(),
        EKWA_BA_SLIDE_VERSION
    );

    wp_register_script(
        'ekwa-ba-slide-script',
        EKWA_BA_SLIDE_URL . 'assets/js/ekwa-slider.js',
        array(),
        EKWA_BA_SLIDE_VERSION,
        true
    );
}
add_action('init', 'ekwa_ba_slide_register_block_assets');

/**
 * Register the Gutenberg block
 */
function ekwa_ba_slide_register_block() {
    // Register block script
    wp_register_script(
        'ekwa-ba-slide-editor',
        EKWA_BA_SLIDE_URL . 'build/block.js',
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
        EKWA_BA_SLIDE_VERSION
    );

    // Register block editor style
    wp_register_style(
        'ekwa-ba-slide-editor-style',
        EKWA_BA_SLIDE_URL . 'assets/css/editor.css',
        array(),
        EKWA_BA_SLIDE_VERSION
    );

    // Register the block
    register_block_type('ekwa/ba-slider', array(
        'editor_script' => 'ekwa-ba-slide-editor',
        'editor_style' => 'ekwa-ba-slide-editor-style',
        'render_callback' => 'ekwa_ba_slide_render_callback',
        'attributes' => array(
            'beforeImage' => array(
                'type' => 'object',
                'default' => array(),
            ),
            'afterImage' => array(
                'type' => 'object',
                'default' => array(),
            ),
            'beforeLabel' => array(
                'type' => 'string',
                'default' => 'BEFORE',
            ),
            'afterLabel' => array(
                'type' => 'string',
                'default' => 'AFTER',
            ),
            'initialPosition' => array(
                'type' => 'number',
                'default' => 50,
            ),
        ),
    ));
}
add_action('init', 'ekwa_ba_slide_register_block');

/**
 * Server-side rendering for the before-after slider block
 */
function ekwa_ba_slide_render_callback($attributes) {
    // Only enqueue the assets when the block is rendered
    if (!wp_script_is('ekwa-ba-slide-script', 'enqueued')) {
        wp_enqueue_script('ekwa-ba-slide-script');
    }

    if (!wp_style_is('ekwa-ba-slide-style', 'enqueued')) {
        wp_enqueue_style('ekwa-ba-slide-style');
    }

    $before_image = isset($attributes['beforeImage']['url']) ? $attributes['beforeImage']['url'] : '';
    $after_image = isset($attributes['afterImage']['url']) ? $attributes['afterImage']['url'] : '';
    $before_label = isset($attributes['beforeLabel']) ? $attributes['beforeLabel'] : 'BEFORE';
    $after_label = isset($attributes['afterLabel']) ? $attributes['afterLabel'] : 'AFTER';
    $initial_position = isset($attributes['initialPosition']) ? intval($attributes['initialPosition']) : 50;

    // Use placeholder images if none provided
    $before_image = $before_image ?: 'https://via.placeholder.com/800x500/666666/cccccc?text=Before+Image';
    $after_image = $after_image ?: 'https://via.placeholder.com/800x500/cccccc/666666?text=After+Image';

    $before_alt = isset($attributes['beforeImage']['alt']) ? $attributes['beforeImage']['alt'] : 'Before';
    $after_alt = isset($attributes['afterImage']['alt']) ? $attributes['afterImage']['alt'] : 'After';

    // Generate a unique ID for this slider instance
    $slider_id = 'ekwa-slider-' . uniqid();

    $html = '<div class="ekwa-container" id="' . esc_attr($slider_id) . '" data-initial-position="' . esc_attr($initial_position) . '">';
    $html .= '  <div class="ekwa-before-wrapper">';
    $html .= '    <img src="' . esc_url($before_image) . '" alt="' . esc_attr($before_alt) . '" class="ekwa-before">';
    $html .= '  </div>';
    $html .= '  <div class="ekwa-after-wrapper">';
    $html .= '    <img src="' . esc_url($after_image) . '" alt="' . esc_attr($after_alt) . '" class="ekwa-after">';
    $html .= '  </div>';
    $html .= '  <div class="ekwa-overlay">';
    $html .= '    <div class="ekwa-before-label">' . esc_html($before_label) . '</div>';
    $html .= '    <div class="ekwa-after-label">' . esc_html($after_label) . '</div>';
    $html .= '  </div>';
    $html .= '  <div class="ekwa-handle">';
    $html .= '    <span class="ekwa-left-arrow"></span>';
    $html .= '    <span class="ekwa-right-arrow"></span>';
    $html .= '  </div>';
    $html .= '</div>';

    return $html;
}