class PerspectiveGroup {
  constructor(el) {
    if ('ontouchstart' in window) {
      return;
    }

    const parent = el;
    this.foregroundItems = parent.querySelectorAll('.js-perspective-foreground');
    this.backgroundItems = parent.querySelectorAll('.js-perspective-background');
    const range = parent.dataset.perspectiveRange || 40;
    const calcValue = (a, b) => (((a / b) * range) - (range / 2)).toFixed(1);

    let timeout;

    parent.style.perspective = '1800px';
    parent.style.transformStyle = 'preserve-3d';

    [].forEach.call(this.backgroundItems, (item) => {
      const bgItem = item;
      bgItem.style.transformStyle = 'preserve-3d';
      bgItem.style.perspective = '1200px';
      bgItem.style.transformOrigin = '50% 50%';
    });

    [].forEach.call(this.foregroundItems, (item) => {
      const foregroundItem = item;
      foregroundItem.style.transformOrigin = '50% 50%';
    });

    document.addEventListener(
      'mousemove',
      ({ y, x }) => {
        if (timeout) {
          window.cancelAnimationFrame(timeout);
        }

        timeout = window.requestAnimationFrame(() => {
          const yValue = calcValue(y, window.innerHeight);
          const xValue = calcValue(x, window.innerWidth);

          [].forEach.call(this.foregroundItems, (item) => {
            const foregroundItem = item;
            foregroundItem.style.transform = `translateX(${xValue}px) translateY(${yValue}px)`;
          });

          [].forEach.call(this.backgroundItems, (item) => {
            const bgItem = item;
            bgItem.style.transform = `rotateX(${xValue * 1.5}deg) rotateY(${yValue * 1.5}deg)`;
          });
        });
      },
      false,
    );
  }
}

window.PerspectiveGroup = PerspectiveGroup;
