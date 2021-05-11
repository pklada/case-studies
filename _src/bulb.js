const { getColorMode, setColorMode } = require('./dark-mode');

class Bulb {
  constructor(el) {
    this.el = el;
    this.button = el.getElementsByClassName('js-bulb-button')[0];
    this.icons = {
      light: el.getElementsByClassName('js-bulb-on')[0],
      dark: el.getElementsByClassName('js-bulb-off')[0],
      auto: el.getElementsByClassName('js-bulb-auto')[0],
    };
    this.setColorMode();

    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );
    darkModeMediaQuery.addListener(() => {
      this.setColorMode();
    });

    this.button.addEventListener('click', () => {
      if (this.colorMode === 'dark') {
        this.setColorMode('light');
      } else if (this.colorMode === 'light') {
        this.setColorMode('auto');
      } else {
        this.setColorMode('dark');
      }
      this.setColorMode();
    });
  }

  setColorMode(colorMode) {
    if (colorMode) {
      this.colorMode = colorMode;
    } else {
      this.colorMode = getColorMode();
    }

    setColorMode(this.colorMode);

    this.setIconVisible();
  }

  setIconVisible() {
    Object.keys(this.icons).forEach((k) => {
      if (k === this.colorMode) {
        this.icons[k].classList.add('is-visible');
      } else {
        this.icons[k].classList.remove('is-visible');
      }
    });
  }
}

window.Bulb = Bulb;
