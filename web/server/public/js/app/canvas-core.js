let tool = 'pen';
const canvas = document.getElementById('drawingCanvas')

const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');

const canvasData = new WeakMap(); // Store state per canvas

function getPos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x, y, pressure: e.pressure || 0.5 };
}

function initializeCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const state = {
        drawing: false,
        undoStack: []
    };

    canvasData.set(canvas, state);  

    function startDraw(e) {
        state.undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        state.drawing = true;
        const pos = getPos(canvas, e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault();
    }

    function draw(e) {
        if (!state.drawing) return;
        const pos = getPos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = (tool === 'pen') ? colorPicker.value : '#0A0A0A';
        ctx.lineWidth = brushSize.value * (pos.pressure || 1) * (tool === 'pen' ? 1 : 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        e.preventDefault();
    }

    function stopDraw() {
        if (state.drawing) {
            ctx.closePath();
            state.drawing = false;
        }
    }

    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDraw);
    canvas.addEventListener('pointerout', stopDraw);
}


function undo(canvas) {
    if (!canvas) {
        console.error("Undo called without a valid canvas.");
        return;
    }

    const ctx = canvas.getContext('2d');
    const s = canvasData.get(canvas);
    if (s && s.undoStack.length > 0) {
        const lastState = s.undoStack.pop();
        ctx.putImageData(lastState, 0, 0);
    }
}


function clearCanvas(canvas) {
    if (confirm('Clear canvas?')) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function setTool(newTool) {
    tool = newTool;
}
