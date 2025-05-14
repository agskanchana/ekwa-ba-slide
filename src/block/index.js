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
                                <div className="ekwa-editor-preview">
                                    <p>{__('Slider Preview (non-interactive in editor)', 'ekwa-ba-slide')}</p>
                                    <div className="ekwa-images-preview">
                                        <div className="ekwa-before-preview" style={{width: `${initialPosition}%`}}>
                                            <img src={beforeImage.url} alt={beforeImage.alt || 'Before'} />
                                            <div className="ekwa-label">{beforeLabel}</div>
                                        </div>
                                        <div className="ekwa-after-preview">
                                            <img src={afterImage.url} alt={afterImage.alt || 'After'} />
                                            <div className="ekwa-label">{afterLabel}</div>
                                        </div>
                                        <div className="ekwa-slider-indicator" style={{left: `${initialPosition}%`}}></div>
                                    </div>
                                </div>
                                <p className="ekwa-editor-note">
                                    {__('The interactive slider will appear on the frontend of your site.', 'ekwa-ba-slide')}
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