/* eslint-disable no-new */
/* eslint-disable no-unused-vars */

class StickyHeader {
  constructor(el, testElClass) {
    this.el = el;
    this.hasScrolled = false;
    this.defaultScrollvalue = 300;

    if (testElClass) {
      this.defaultScrollvalue = document.querySelector(testElClass).offsetHeight;
    }

    this.setupScrollEvent();
  }

  setupScrollEvent() {
    window.addEventListener('scroll', this.checkScrollPosition.bind(this));
  }

  checkScrollPosition() {
    if (window.scrollY > this.defaultScrollvalue && this.hasScrolled === false) {
      this.hasScrolled = true;
      this.setupForScrolled(true);
    } else if (window.scrollY < this.defaultScrollvalue && this.hasScrolled === true) {
      this.hasScrolled = false;
      this.setupForScrolled(false);
    }
  }

  setupForScrolled(isScrolled) {
    if (isScrolled) {
      this.el.classList.add('is-scrolled');
    } else {
      this.el.classList.remove('is-scrolled');
    }
  }
}

window.StickyHeader = StickyHeader;
