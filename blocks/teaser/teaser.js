import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const picture = block.querySelector('picture');
  let heading = block.querySelector('h1, h2, h3, h4, h5, h6');

  // Fall back to the first non-empty text cell when no heading was authored.
  if (!heading) {
    const textCell = [...block.querySelectorAll('div')]
      .find((div) => !div.querySelector('picture') && div.textContent.trim());
    if (textCell) {
      heading = document.createElement('h2');
      heading.textContent = textCell.textContent.trim();
    }
  }

  block.replaceChildren();

  if (picture) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'teaser-image';
    const img = picture.querySelector('img');
    imageWrapper.append(
      img
        ? createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
        : picture,
    );
    block.append(imageWrapper);
  }

  if (heading) {
    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'teaser-title';
    titleWrapper.append(heading);
    block.append(titleWrapper);
  }
}
