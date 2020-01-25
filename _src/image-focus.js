/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-new */

class ImageFocus {
    constructor(el, src, caption) {
        this.element = el;
        this.src = src;
        this.caption = caption;
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

        document.body.appendChild(this.overlay);
        this.element.appendChild(zoomIndicator);
    }

    createCaption() {
        const caption = document.createElement('p');
        caption.textContent = this.caption;
        caption.classList.add('imageFocus_caption');
        this.overlay.appendChild(caption);
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
