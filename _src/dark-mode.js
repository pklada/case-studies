const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const faviconDarkModeSrc = '/favicon-dark.ico';
const faviconLightModeSrc = '/favicon.ico';

const setFavicon = (darkModeOn) => {
  const link = document.querySelector("link[rel*='icon']");
  link.href = darkModeOn ? faviconDarkModeSrc : faviconLightModeSrc;
};

darkModeMediaQuery.addListener((e) => {
  setFavicon(e.matches);
});

document.addEventListener('DOMContentLoaded', () => {
  setFavicon(window.matchMedia('(prefers-color-scheme: dark)').matches);
});
