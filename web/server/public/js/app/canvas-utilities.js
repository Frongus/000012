function clearCanvas() {
  if (confirm("Do you really want to delete the Canvas? This action cannot be undone")) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function extendCanvas(canvas, extraHeight = 800) {
  const ctx = canvas.getContext('2d');
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);

  canvas.height += extraHeight;
  ctx.drawImage(tempCanvas, 0, 0);
}

