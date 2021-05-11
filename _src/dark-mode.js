const { getCookie, setCookie } = require('./cookies');

export const COLOR_MODE_COOKIE_NAME = 'color-mode';

const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const faviconDarkModeSrc = '/favicon-dark.ico';
const faviconLightModeSrc = '/favicon.ico';

const setFavicon = (darkModeOn) => {
  const link = document.querySelector("link[rel*='icon']");
  link.href = darkModeOn ? faviconDarkModeSrc : faviconLightModeSrc;
};

const getIsSystemDarkMode = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export const getColorMode = () => {
  if (getCookie(COLOR_MODE_COOKIE_NAME)) {
    return getCookie(COLOR_MODE_COOKIE_NAME);
  }

  return 'auto';
};

const setClassNameOnBody = () => {
  if (
    getColorMode() === 'dark' ||
    (getColorMode() === 'auto' && getIsSystemDarkMode())
  ) {
    document.getElementsByTagName('body')[0].classList.add('prefers-dark');
  } else if (
    getColorMode() === 'light' ||
    (getColorMode() === 'auto' && !getIsSystemDarkMode())
  ) {
    document.getElementsByTagName('body')[0].classList.remove('prefers-dark');
  }
};

export const setColorMode = (colorMode) => {
  setCookie(COLOR_MODE_COOKIE_NAME, colorMode);
  setClassNameOnBody();
};

darkModeMediaQuery.addListener((e) => {
  setFavicon(e.matches);

  if (getColorMode() === 'auto') {
    setColorMode();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setFavicon(window.matchMedia('(prefers-color-scheme: dark)').matches);
  setClassNameOnBody();
});
