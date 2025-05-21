let canvas = document.querySelectorAll('canvas');

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('drawingCanvas');
  if (canvas) initializeCanvas(canvas); // from canvas-core.js

  document.getElementById('eraserBtn').addEventListener('click', () => {
    tool = (tool === 'eraser') ? 'pen' : 'eraser';
  });

  document.getElementById('canvasWrapper').addEventListener('scroll', () => {
    const scrollY = canvasWrapper.scrollTop;
    const viewportHeight = canvasWrapper.clientHeight;
    const fullHeight = canvasWrapper.scrollHeight;
    if (scrollY + viewportHeight >= fullHeight - 100) {
      // If you want to use extendCanvas, pass in the current canvas!
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
});

function getCurrentCanvas() {
    const canvases = document.querySelectorAll('.pageCanvas');
    return canvases[canvases.length - 1]; // or whichever is considered "active"
}

document.getElementById('undoBtn').addEventListener('click', () => {
    undo(activeCanvas);
});

document.getElementById('redoBtn').addEventListener('click', () => {
    redo(activeCanvas);
});