import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
    MediaPlaceholder,
    InspectorControls,
    MediaUpload,
    RichText
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    TextControl,
    Button
} from '@wordpress/components';

// Import our CSS styles
import './style.scss';

// Register the block
registerBlockType('ekwa/ba-slider', {
    title: __('EKWA Before-After Slider', 'ekwa-ba-slide'),
    icon: 'image-flip-horizontal',
    category: 'media',
    attributes: {
        beforeImage: {
            type: 'object',
            default: {}
        },
        afterImage: {
            type: 'object',
            default: {}
        },
        beforeLabel: {
            type: 'string',
            default: 'BEFORE'
        },
        afterLabel: {
            type: 'string',
            default: 'AFTER'
        },
        initialPosition: {
            type: 'number',
            default: 50
        }
    },

    // Define the UI for the block editing experience
    edit: (props) => {
        const { attributes, setAttributes } = props;
        const { beforeImage, afterImage, beforeLabel, afterLabel, initialPosition } = attributes;

        // Handler for selecting before image
        const onSelectBeforeImage = (media) => {
            setAttributes({
                beforeImage: {
                    url: media.url,
                    id: media.id,
                    alt: media.alt || ''
                }
            });
        };

        // Handler for selecting after image
        const onSelectAfterImage = (media) => {
            setAttributes({
                afterImage: {
                    url: media.url,
                    id: media.id,
                    alt: media.alt || ''
                }
            });
        };

        // The edit UI
        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Slider Settings', 'ekwa-ba-slide')}>
                        <TextControl
                            label={__('Before Label', 'ekwa-ba-slide')}
                            value={beforeLabel}
                            onChange={(value) => setAttributes({ beforeLabel: value })}
                        />
                        <TextControl
                            label={__('After Label', 'ekwa-ba-slide')}
                            value={afterLabel}
                            onChange={(value) => setAttributes({ afterLabel: value })}
                        />
                        <RangeControl
                            label={__('Initial Slider Position (%)', 'ekwa-ba-slide')}
                            value={initialPosition}
                            onChange={(value) => setAttributes({ initialPosition: value })}
                            min={0}
                            max={100}
                        />

                        <div className="ekwa-image-selectors">
                            <p>{__('Before Image:', 'ekwa-ba-slide')}</p>
                            {beforeImage.url ? (
                                <div className="ekwa-image-preview">
                                    <img src={beforeImage.url} alt={beforeImage.alt || ''} />
                                    <MediaUpload
                                        onSelect={onSelectBeforeImage}
                                        allowedTypes={['image']}
                                        value={beforeImage.id}
                                        render={({ open }) => (
                                            <Button
                                                onClick={open}
                                                isPrimary
                                            >
                                                {__('Replace Image', 'ekwa-ba-slide')}
                                            </Button>
                                        )}
                                    />
                                </div>
                            ) : (
                                <MediaUpload
                                    onSelect={onSelectBeforeImage}
                                    allowedTypes={['image']}
                                    render={({ open }) => (
                                        <Button
                                            onClick={open}
                                            isPrimary
                                        >
                                            {__('Select Before Image', 'ekwa-ba-slide')}
                                        </Button>
                                    )}
                                />
                            )}

                            <p>{__('After Image:', 'ekwa-ba-slide')}</p>
                            {afterImage.url ? (
                                <div className="ekwa-image-preview">
                                    <img src={afterImage.url} alt={afterImage.alt || ''} />
                                    <MediaUpload
                                        onSelect={onSelectAfterImage}
                                        allowedTypes={['image']}
                                        value={afterImage.id}
                                        render={({ open }) => (
                                            <Button
                                                onClick={open}
                                                isPrimary
                                            >
                                                {__('Replace Image', 'ekwa-ba-slide')}
                                            </Button>
                                        )}
                                    />
                                </div>
                            ) : (
                                <MediaUpload
                                    onSelect={onSelectAfterImage}
                                    allowedTypes={['image']}
                                    render={({ open }) => (
                                        <Button
                                            onClick={open}
                                            isPrimary
                                        >
                                            {__('Select After Image', 'ekwa-ba-slide')}
                                        </Button>
                                    )}
                                />
                            )}
                        </div>
                    </PanelBody>
                </InspectorControls>

                <div className={props.className}>
                    <div className="ekwa-editor-container">
                        <h3>{__('EKWA Before-After Slider', 'ekwa-ba-slide')}</h3>

                        {!beforeImage.url || !afterImage.url ? (
                            <div className="ekwa-image-placeholders">
                                {!beforeImage.url && (
                                    <MediaPlaceholder
                                        icon="format-image"
                                        labels={{
                                            title: __('Before Image', 'ekwa-ba-slide'),
                                            instructions: __('Upload or select a before image', 'ekwa-ba-slide')
                                        }}
                                        onSelect={onSelectBeforeImage}
                                        accept="image/*"
                                        allowedTypes={['image']}
                                    />
                                )}

                                {!afterImage.url && (
                                    <MediaPlaceholder
                                        icon="format-image"
                                        labels={{
                                            title: __('After Image', 'ekwa-ba-slide'),
                                            instructions: __('Upload or select an after image', 'ekwa-ba-slide')
                                        }}
                                        onSelect={onSelectAfterImage}
                                        accept="image/*"
                                        allowedTypes={['image']}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="ekwa-preview-container">
                                {/* Enhanced static preview that mimics frontend appearance */}
                                <div className="ekwa-static-preview">
                                    <div className="ekwa-container" style={{
                                        position: 'relative',
                                        width: '100%',
                                        height: '350px',
                                        overflow: 'hidden',
                                        borderRadius: '5px',
                                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                                    }}>
                                        <div
                                            className="ekwa-before-wrapper"
                                            style={{
                                                clipPath: `inset(0 ${100 - initialPosition}% 0 0)`,
                                                WebkitClipPath: `inset(0 ${100 - initialPosition}% 0 0)`,
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                zIndex: 20,
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <img
                                                src={beforeImage.url || "https://via.placeholder.com/800x500/666666/cccccc?text=Before+Image"}
                                                alt={beforeImage.alt || 'Before'}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>
                                        <div
                                            className="ekwa-after-wrapper"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                zIndex: 10,
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <img
                                                src={afterImage.url || "https://via.placeholder.com/800x500/cccccc/666666?text=After+Image"}
                                                alt={afterImage.alt || 'After'}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        </div>

                                        {/* Labels */}
                                        <div className="ekwa-overlay" style={{
                                            position: 'absolute',
                                            top: 0,
                                            width: '100%',
                                            height: '100%',
                                            zIndex: 25,
                                            pointerEvents: 'none'
                                        }}>
                                            <div
                                                className="ekwa-before-label"
                                                style={{
                                                    position: 'absolute',
                                                    background: 'rgba(0, 0, 0, 0.6)',
                                                    color: 'white',
                                                    padding: '8px 15px',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    borderRadius: '4px',
                                                    bottom: '20px',
                                                    left: '20px',
                                                    opacity: 1
                                                }}
                                            >
                                                {beforeLabel}
                                            </div>
                                            <div
                                                className="ekwa-after-label"
                                                style={{
                                                    position: 'absolute',
                                                    background: 'rgba(0, 0, 0, 0.6)',
                                                    color: 'white',
                                                    padding: '8px 15px',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    borderRadius: '4px',
                                                    bottom: '20px',
                                                    right: '20px',
                                                    opacity: 1
                                                }}
                                            >
                                                {afterLabel}
                                            </div>
                                        </div>

                                        {/* Static slider handle with fixed vertical lines */}
                                        <div
                                            className="ekwa-handle"
                                            style={{
                                                position: 'absolute',
                                                zIndex: 30,
                                                height: '48px',
                                                width: '48px',
                                                borderRadius: '50%',
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                left: `${initialPosition}%`,
                                                top: '50%',
                                                marginLeft: '-24px',
                                                marginTop: '-24px',
                                                boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <span
                                                className="ekwa-left-arrow"
                                                style={{
                                                    position: 'absolute',
                                                    width: 0,
                                                    height: 0,
                                                    border: '7px solid transparent',
                                                    top: '50%',
                                                    marginTop: '-7px',
                                                    left: '50%',
                                                    marginLeft: '-19px',
                                                    borderRight: '7px solid #2c3e50'
                                                }}
                                            ></span>
                                            <span
                                                className="ekwa-right-arrow"
                                                style={{
                                                    position: 'absolute',
                                                    width: 0,
                                                    height: 0,
                                                    border: '7px solid transparent',
                                                    top: '50%',
                                                    marginTop: '-7px',
                                                    right: '50%',
                                                    marginRight: '-19px',
                                                    borderLeft: '7px solid #2c3e50'
                                                }}
                                            ></span>

                                            {/* Vertical line with controlled height */}
                                            <div style={{
                                                position: 'absolute',
                                                width: '3px',
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                height: '1000%',
                                                maxHeight: '175px',
                                                left: '50%',
                                                marginLeft: '-1.5px',
                                                top: '100%',
                                                boxShadow: '0 0 12px rgba(0, 0, 0, 0.5)'
                                            }}></div>
                                            <div style={{
                                                position: 'absolute',
                                                width: '3px',
                                                background: 'rgba(255, 255, 255, 0.9)',
                                                height: '1000%',
                                                maxHeight: '175px',
                                                left: '50%',
                                                marginLeft: '-1.5px',
                                                bottom: '100%',
                                                boxShadow: '0 0 12px rgba(0, 0, 0, 0.5)'
                                            }}></div>
                                        </div>
                                    </div>
                                </div>
                                <p className="ekwa-editor-note" style={{marginTop: '10px', fontStyle: 'italic', color: '#777'}}>
                                    {__('Drag the slider control in preview to adjust the initial position.', 'ekwa-ba-slide')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    },

    // Define the saved output - this is an empty function since we're using PHP to render
    save: () => {
        return null; // Using PHP server-side rendering
    },
});