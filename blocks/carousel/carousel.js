import { createOptimizedPicture } from '../../scripts/aem.js';

function showSlide(block, index) {
  const slides = block.querySelectorAll('.carousel-slide');
  if (!slides.length) return;
  const nextIndex = (index + slides.length) % slides.length;
  block.dataset.activeSlide = nextIndex;
  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', i === nextIndex ? 'false' : 'true');
  });
  const dots = block.querySelectorAll('.carousel-dot');
  dots.forEach((dot, i) => {
    dot.setAttribute('aria-selected', i === nextIndex ? 'true' : 'false');
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  block.replaceChildren();

  const track = document.createElement('div');
  track.className = 'carousel-track';

  rows.forEach((row) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    while (row.firstElementChild) slide.append(row.firstElementChild);
    slide.querySelectorAll('picture > img').forEach((img) => {
      img.closest('picture').replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
      );
    });
    track.append(slide);
  });

  block.append(track);

  const slides = track.querySelectorAll('.carousel-slide');
  if (slides.length <= 1) {
    showSlide(block, 0);
    return;
  }

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-nav carousel-nav-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.addEventListener('click', () => {
    showSlide(block, Number(block.dataset.activeSlide) - 1);
  });

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-nav carousel-nav-next';
  next.setAttribute('aria-label', 'Next slide');
  next.addEventListener('click', () => {
    showSlide(block, Number(block.dataset.activeSlide) + 1);
  });

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Show slide ${i + 1}`);
    dot.addEventListener('click', () => showSlide(block, i));
    dots.append(dot);
  });

  block.append(prev, next, dots);
  showSlide(block, 0);
}
