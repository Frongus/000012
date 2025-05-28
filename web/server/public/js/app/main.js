let canvas = document.querySelectorAll('canvas');

function redrawCanvas() {
  const canvas = getCurrentCanvas();
  const ctx = canvas.getContext('2d');

  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear

  applyCanvasTransform(ctx);

  // TODO: replay stored drawing actions here
}



window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('drawingCanvas');
  if (canvas) initializeCanvas(canvas); 

  document.getElementById('eraserBtn').addEventListener('click', () => {
    tool = (tool === 'eraser') ? 'pen' : 'eraser';
  });

  document.getElementById('canvasWrapper').addEventListener('scroll', () => {
    const scrollY = canvasWrapper.scrollTop;
    const viewportHeight = canvasWrapper.clientHeight;
    const fullHeight = canvasWrapper.scrollHeight;
    if (scrollY + viewportHeight >= fullHeight - 100) {
      const canvases = document.querySelectorAll('.pageCanvas');
      const lastCanvas = canvases[canvases.length - 1];
      extendCanvas(lastCanvas);
    }
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      const canvases = document.querySelectorAll('.pageCanvas');
      const lastCanvas = canvases[canvases.length - 1];
      undo(lastCanvas);
    }
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      const canvases = document.querySelectorAll('.pageCanvas');
      const lastCanvas = canvases[canvases.length - 1];
      redo(lastCanvas);
    }
  });
});

function getCurrentCanvas() {
    const canvases = document.querySelectorAll('.pageCanvas');
    return canvases[canvases.length - 1];
}

document.getElementById('undoBtn').addEventListener('click', () => {
    undo(activeCanvas);
});

document.getElementById('redoBtn').addEventListener('click', () => {
    redo(activeCanvas);
});