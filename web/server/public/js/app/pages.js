import { attachCanvasEvents } from './canvas-core.js';

let pageCount = 1;
const pagesContainer = document.body;

export function createPage() {
  pageCount += 1;
  const pageId = `page-${pageCount}`;

  const page = document.createElement('div');
  page.className = 'page zoomable';
  page.id = pageId;

  page.innerHTML = `
    <div id="canvasWrapper-${pageCount}" class="canvasWrapper">
      <canvas id="drawingCanvas-${pageCount}" width="1500" height="1600"></canvas>
    </div>
    <button class="addPageBtn">＋ New Page</button>
  `;

  pagesContainer.appendChild(page);
  attachCanvasEvents(document.getElementById(`drawingCanvas-${pageCount}`));
  page.querySelector('.addPageBtn').addEventListener('click', createPage);
  enableZoom(page);
}

function enableZoom(target) {
  let scale = 1;
  const clamp = (v, min = 0.3, max = 3) => Math.min(max, Math.max(min, v));

  target.addEventListener('wheel', (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    scale = clamp(scale - e.deltaY * 0.001);
    target.style.transform = `scale(${scale})`;
  }, { passive: false });

  let startDist = 0, startScale = 1;
  target.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      startDist = distance(e.touches[0], e.touches[1]);
      startScale = scale;
    }
  });

  target.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const newDist = distance(e.touches[0], e.touches[1]);
      scale = clamp(startScale * (newDist / startDist));
      target.style.transform = `scale(${scale})`;
    }
  }, { passive: false });

  const distance = (p1, p2) =>
    Math.hypot(p1.pageX - p2.pageX, p1.pageY - p2.pageY);
}

document.querySelector('#page-1 .addPageBtn')
        .addEventListener('click', createPage);
enableZoom(document.getElementById('page-1'));