let tool = 'pen';
let activeCanvas = null;
const canvasData = new WeakMap(); // Store state per canvas

const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');

canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

window.isZooming = false;
let ongoingTouches = [];

function copyTouch(touch) {
    return { identifier: touch.identifier, clientX: touch.clientX, clientY: touch.clientY };
}

function handleTouchStart(evt) {
    for (let i = 0; i < evt.changedTouches.length; i++) {
        ongoingTouches.push(copyTouch(evt.changedTouches[i]));
    }
    if (ongoingTouches.length === 2) {
        window.isZooming = true;
    }
}

function handleTouchEnd(evt) {
    for (let i = 0; i < evt.changedTouches.length; i++) {
        const idx = ongoingTouches.findIndex(t => t.identifier === evt.changedTouches[i].identifier);
        if (idx >= 0) ongoingTouches.splice(idx, 1);
    }
    if (ongoingTouches.length < 2) {
        window.isZooming = false;
    }
}

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
        undoStack: [],
        redoStack: []
    };

    canvasData.set(canvas, state);

    function startDraw(e) {
        if (window.isZooming) return;
        state.undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        state.redoStack = [];
        state.drawing = true;
        const pos = getPos(canvas, e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        e.preventDefault();
    }

    function draw(e) {
        if (window.isZooming || !state.drawing) return;
        const pos = getPos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = (tool === 'pen') ? colorPicker.value : '#FFFFFF';
        ctx.lineWidth = brushSize.value * (pos.pressure || 1) * (tool === 'pen' ? 1 : 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        e.preventDefault();
    }

    function stopDraw() {
        if (window.isZooming) return;
        if (state.drawing) {
            ctx.closePath();
            state.drawing = false;
        }
    }

    // Drawing events
    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDraw);
    canvas.addEventListener('pointerout', stopDraw);

    // Touch events for zoom tracking
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    // Activate canvas on interaction
    canvas.addEventListener('pointerdown', () => setActiveCanvas(canvas));
}

function undo(canvas = getActiveCanvas()) {
    if (!canvas) return console.warn("No active canvas selected for undo.");
    const ctx = canvas.getContext('2d');
    const s = canvasData.get(canvas);
    if (s && s.undoStack.length > 0) {
        const lastState = s.undoStack.pop();
        s.redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(lastState, 0, 0);
    }
}

function redo(canvas = getActiveCanvas()) {
    if (!canvas) return console.warn("No active canvas selected for redo.");
    const ctx = canvas.getContext('2d');
    const s = canvasData.get(canvas);
    if (s && s.redoStack.length > 0) {
        const nextState = s.redoStack.pop();
        s.undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(nextState, 0, 0);
    }
}

function autoZoomOut(canvas) {
    const container = canvas.parentElement || document.body;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const scaleX = containerWidth / canvas.width;
    const scaleY = containerHeight / canvas.height;
    const scale = Math.min(scaleX, scaleY);

    canvas.style.transformOrigin = '0 0';
    canvas.style.transform = `scale(${scale})`;
}

function setTool(newTool) {
    tool = newTool;
}

function setActiveCanvas(canvas) {
    activeCanvas = canvas;
}

function getActiveCanvas() {
    return activeCanvas;
}
