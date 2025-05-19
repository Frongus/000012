const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
let drawing = false;
const undoStack = [];

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.pageX - rect.left - window.scrollX,
    y: e.pageY - rect.top - window.scrollY,
    pressure: e.pressure || 0.5
  };
}

function startDraw(e) {
  if (['mouse', 'pen', 'touch'].includes(e.pointerType)) {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    e.preventDefault();
  }
}

function draw(e) {
  if (!drawing) return;
  const pos = getPos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.strokeStyle = (tool === 'pen') ? colorPicker.value : '#0A0A0A';
  ctx.lineWidth = brushSize.value * (e.pressure || 1) * (tool === 'pen' ? 1 : 2);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  e.preventDefault();
}

function stopDraw(e) {
  if (drawing) {
    ctx.closePath();
    drawing = false;
    e.preventDefault();
  }
}

function undo() {
  if (undoStack.length === 0) return;
  const lastState = undoStack.pop();
  ctx.putImageData(lastState, 0, 0);
}
