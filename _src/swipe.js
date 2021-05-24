import throttle from 'lodash/throttle';

const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom - (el.clientHeight / 3) <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

class SwipeableImage {
  constructor(el) {
    this.el = el;
    this.handle = el.getElementsByClassName('js-swipe-handle')[0];
    this.swipe = el.getElementsByClassName('js-swipe-item')[0];
    this.swipeChild = this.swipe.getElementsByTagName('div')[0];

    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.throttledHandleScroll = throttle(this.handleScroll, 250);

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
    this.hasAnimated = false;
    this.isPristine = true;

    if (el.dataset.swipeAnimate) {
      this.setTranslate(20);
      this.xOffset = 20;
      window.addEventListener('scroll', this.throttledHandleScroll);
      window.addEventListener('load', this.handleScroll, { once: true });
    } else {
      this.setTranslate(this.xOffset);
    }
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

    this.isPristine = false;

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

  handleScroll() {
    if (isElementInViewport(this.el)) {
      window.removeEventListener('scroll', this.throttledHandleScroll);
      this.animate();
    }
  }

  animate() {
    if (this.hasAnimated || !this.isPristine) {
      return;
    }

    let startTime;
    const startOffset = 20;
    const duration = 1000;
    const targetOffset = this.width / 2;

    /* eslint-disable */
    const easeInOutCubic = (t, b, c, d) => {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
      return (c / 2) * ((t -= 2) * t * t + 2) + b;
    };
    /* eslint-enable */

    if (duration > 0) {
      this.active = false;

      const anim = (timestamp) => {
        startTime = startTime || timestamp;
        const elapsed = timestamp - startTime;
        const progress = easeInOutCubic(
          elapsed,
          startOffset,
          targetOffset - startOffset,
          duration,
        );
        this.setTranslate(progress);
        if (elapsed < duration) {
          requestAnimationFrame(anim);
        } else {
          this.setTranslate(targetOffset);
        }
      };
      requestAnimationFrame(anim);
    } else {
      this.setTranslate(targetOffset);
      this.hasAnimated = true;
      this.active = true;
    }
  }
}

window.SwipeableImage = SwipeableImage;
