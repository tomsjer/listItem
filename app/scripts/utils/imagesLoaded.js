export default function imagesLoaded(el) {
  const src = el.dataset.src;
  el.onload = function onLoad() {
    el.classList.remove('loading');
  };
  el.src = src;
}
