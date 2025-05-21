let scale = 1;
let lastDistance = null;
let isPanning = false;
let lastTouchMid = null;
let isZooming = false; // 🆕 Add this flag

const wrapper = document.getElementById('canvasWrapper');

wrapper.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    isZooming = true;
    const dist = getTouchDistance(e.touches);
    lastDistance = dist;
    lastTouchMid = getTouchMidpoint(e.touches);
    isPanning = true;
  }
}, { passive: false });

wrapper.addEventListener('touchmove', (e) => {
  if (e.touches.length === 2 && isPanning) {
    e.preventDefault();
    const newDist = getTouchDistance(e.touches);
    const midpoint = getTouchMidpoint(e.touches);

    const deltaScale = newDist / lastDistance;
    scale *= deltaScale;
    scale = Math.max(0.5, Math.min(scale, 5));

    wrapper.style.transform = `scale(${scale})`;

    lastDistance = newDist;
    lastTouchMid = midpoint;
  }
}, { passive: false });

wrapper.addEventListener('touchend', (e) => {
  if (e.touches.length < 2) {
    lastDistance = null;
    isPanning = false;
    isZooming = false; // 🆕 Reset flag when done
  }
});


let translateX = 0;
let translateY = 0;

const container = canvas.parentElement || document.body;

function applyTransform(ctx) {
  ctx.setTransform(scale, 0, 0, scale, translateX, translateY);
}

function redrawCanvas() {
  const ctx = canvas.getContext('2d');
  // Clear before redraw
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply current zoom/pan
  applyTransform(ctx);

  // TODO: redraw your canvas content here
  // e.g. redraw your paths, images, etc.

  // Since you use getImageData for undo, 
  // you might want to store the current drawing in a backing store and redraw here
}

function autoZoomOut() {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const scaleX = containerWidth / canvas.width;
  const scaleY = containerHeight / canvas.height;

  // Use the smaller scale to fit entire canvas
  scale = Math.min(scaleX, scaleY);

  // Center the canvas in the container
  translateX = (containerWidth - canvas.width * scale) / 2;
  translateY = (containerHeight - canvas.height * scale) / 2;

  // Redraw with new transform
  redrawCanvas();
}
