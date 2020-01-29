/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-new */

const zoomEnum = Object.freeze({
    fit: 1, 
    zoom: 2, 
    full: 3,
});

class ImageFocus {
    constructor(el, src, caption) {
        this.element = el;
        this.src = src;
        this.caption = caption;
        this.zoomMode = zoomEnum.fit;

        this.setup();
        this.createOverlay();
        this.attachEvents();
    }

    setup() {
        this.element.classList.add('is-focusable');
    }
    
    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('imageFocus');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('imageFocus_imageContainer');

        let asset;

        if (this.element.dataset.imageSrc) {
            asset = document.createElement('img');
            asset.classList.add('imageFocus_image');
            asset.src = this.src;
        } else if (this.element.dataset.videoSrc) {
            asset = document.createElement('video');
            asset.setAttribute('autoplay', true);
            asset.setAttribute('muted', true);
            asset.setAttribute('loop', true);
            const videoSrc = document.createElement('source');
            asset.classList.add('imageFocus_image');
            videoSrc.src = this.src;
            asset.appendChild(videoSrc);
        }

        this.closeButton = document.createElement('button');
        this.closeButton.classList.add('imageFocus_close');

        const zoomIndicator = document.createElement('div');
        zoomIndicator.classList.add('image_zoomIndicator');

        imageContainer.appendChild(asset);
        imageContainer.appendChild(this.closeButton);

        this.overlay.appendChild(imageContainer);

        if (this.caption) {
            this.createCaption();
        }

        this.createControls();
        this.configureZoom(this.zoomMode);

        document.body.appendChild(this.overlay);
        this.element.appendChild(zoomIndicator);
    }

    createControls() {
        this.controls = document.createElement('div');
        this.controls.classList.add('imageFocus_controls');

        this.fitButton = document.createElement('button');
        this.zoomButton = document.createElement('button');
        this.fullButton = document.createElement('button');

        this.fitButton.classList.add('imageFocus_controlFitButton', 'imageFocus_controlButton');
        this.zoomButton.classList.add('imageFocus_controlZoomButton', 'imageFocus_controlButton');
        this.fullButton.classList.add('imageFocus_controlFullButton', 'imageFocus_controlButton');

        this.zoomButton.textContent = 'Zoom';
        this.fitButton.textContent = 'Fit';
        this.fullButton.textContent = '100%';

        this.controls.appendChild(this.fitButton);
        // this.controls.appendChild(this.zoomButton);
        this.controls.appendChild(this.fullButton);

        this.overlay.appendChild(this.controls);
    }

    createCaption() {
        const caption = document.createElement('p');
        caption.textContent = this.caption;
        caption.classList.add('imageFocus_caption');
        this.overlay.appendChild(caption);
    }

    configureZoom(zoomMode) {
        this.zoomMode = zoomMode;

        if (this.zoomMode === zoomEnum.fit) {
            this.zoomButton.classList.remove('is-selected');
            this.fullButton.classList.remove('is-selected');
            this.fitButton.classList.add('is-selected');
            this.overlay.dataset.zoomMode = 'fit';
        } else if (this.zoomMode === zoomEnum.zoom) {
            this.zoomButton.classList.add('is-selected');
            this.fullButton.classList.remove('is-selected');
            this.fitButton.classList.remove('is-selected');
            this.overlay.dataset.zoomMode = 'zoom';
        } else if (this.zoomMode === zoomEnum.full) {
            this.zoomButton.classList.remove('is-selected');
            this.fullButton.classList.add('is-selected');
            this.fitButton.classList.remove('is-selected');
            this.overlay.dataset.zoomMode = 'full';
        }
    }

    attachEvents() {
        const that = this;
        this.element.addEventListener('click', () => {
            that.openOverlay();
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'Escape') {
                that.closeOverlay();
            }
        });

        this.closeButton.addEventListener('click', () => {
            that.closeOverlay();
        }, true);

        this.zoomButton.addEventListener('click', this.configureZoom.bind(this, zoomEnum.zoom));
        this.fullButton.addEventListener('click', this.configureZoom.bind(this, zoomEnum.full));
        this.fitButton.addEventListener('click', this.configureZoom.bind(this, zoomEnum.fit));
    }

    openOverlay() {
        this.overlay.classList.add('is-open');
        document.getElementsByTagName('html')[0].classList.add('has-open-overlay');
    }

    closeOverlay() {
        this.overlay.classList.remove('is-open');
        document.getElementsByTagName('html')[0].classList.remove('has-open-overlay');
    }
}

document.querySelectorAll('.js-image-focus').forEach((element) => {
    const src = element.dataset.imageSrc || element.dataset.videoSrc;
    new ImageFocus(element, src, element.dataset.caption);
});
