import throttle from 'lodash/throttle';

class SwipeableImage {
  constructor(el) {
    this.el = el;
    this.handle = el.getElementsByClassName('js-swipe-handle')[0];
    this.swipe = el.getElementsByClassName('js-swipe-item')[0];
    this.swipeChild = this.swipe.getElementsByTagName('div')[0];

    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);

    this.throttledHandleDrag = throttle(this.handleDrag, 250);

    this.el.addEventListener('mousemove', this.handleDrag, false);
    this.el.addEventListener('mousedown', this.handleDragStart, false);
    this.el.addEventListener('mouseup', this.handleDragEnd, false);

    this.el.addEventListener('touchstart', this.handleDragStart, false);
    this.el.addEventListener('touchend', this.handleDragEnd, false);
    this.el.addEventListener('touchmove', this.handleDrag, false);

    this.currentX = null;
    this.initialX = null;
    this.xOffset = this.el.clientWidth / 2;
    this.width = this.el.clientWidth;

    this.active = false;

    this.setTranslate(this.xOffset);
  }

  handleDragStart(e) {
    if (e.type === 'touchstart') {
      this.initialX = e.touches[0].clientX - this.xOffset;
    } else {
      this.initialX = e.clientX - this.xOffset;
    }

    if (e.target === this.handle) {
      this.active = true;
    }
  }

  handleDrag(e) {
    if (!this.active) {
      return;
    }

    e.preventDefault();

    if (e.type === 'touchmove') {
      this.currentX = e.touches[0].clientX - this.initialX;
    } else {
      this.currentX = e.clientX - this.initialX;
    }

    this.xOffset = this.currentX;

    this.setTranslate(this.currentX);
  }

  handleDragEnd() {
    this.initialX = this.currentX;
    this.active = false;
  }

  setTranslate(x) {
    let desiredX = x;
    if (desiredX < 0) {
      desiredX = 0;
    }

    if (desiredX > this.width) {
      desiredX = this.width;
    }

    this.swipe.style.transform = `translateX(${-(this.width - desiredX)}px)`;
    this.swipeChild.style.transform = `translateX(${this.width - desiredX}px)`;
    this.handle.style.transform = `translate3d(${desiredX}px, 0, 0)`;
  }
}

window.SwipeableImage = SwipeableImage;
