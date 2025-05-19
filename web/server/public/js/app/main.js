let tool = 'pen';

canvas.addEventListener('pointerdown', startDraw);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDraw);
canvas.addEventListener('pointerout', stopDraw);

document.getElementById('eraserBtn').addEventListener('click', () => {
  tool = (tool === 'eraser') ? 'pen' : 'eraser';
});

if (undoStack.length > 50) undoStack.shift();

document.getElementById('canvasWrapper').addEventListener('scroll', () => {
  const scrollY = canvasWrapper.scrollTop;
  const viewportHeight = canvasWrapper.clientHeight;
  const fullHeight = canvasWrapper.scrollHeight;
  if (scrollY + viewportHeight >= fullHeight - 100) {
    extendCanvas();
  }
});

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    undo();
  }
});
