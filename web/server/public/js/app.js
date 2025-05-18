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
    if (e.pointerType === 'mouse' || e.pointerType === 'pen' || e.pointerType === 'touch') {
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // <-- Save state
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
    ctx.lineWidth = brushSize.value * (e.pressure || 1) * (tool === 'pen' ? 1 : 2); // bigger eraser
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

canvas.addEventListener('pointerdown', startDraw);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDraw);
canvas.addEventListener('pointerout', stopDraw);

function makeMovable(el) {
    let offsetX = 0, offsetY = 0, isDown = false;

    el.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'TD' || e.target.tagName === 'TH') return;
        isDown = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        el.style.zIndex = 1000;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        el.style.left = `${e.pageX - offsetX}px`;
        el.style.top = `${e.pageY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDown = false;
        el.style.zIndex = '';
    });
}

function addTextbox() {
    const textbox = document.createElement('div');
    textbox.className = 'floating-textbox';
    textbox.style.left = '100px';
    textbox.style.top = '100px';

    const textarea = document.createElement('textarea');
    textarea.rows = 4;
    textarea.cols = 20;

    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    delBtn.style.float = 'right';
    delBtn.style.cursor = 'pointer';
    delBtn.onclick = () => textbox.remove();

    textbox.appendChild(delBtn);
    textbox.appendChild(textarea);
    makeMovable(textbox);
    document.getElementById('canvasWrapper').appendChild(textbox);
}

function addTable() {
    const container = document.createElement('div');
    container.className = 'floating-table';
    container.style.left = '200px';
    container.style.top = '200px';
    container.innerHTML = `
        <table contenteditable="true">
          <tr><th>Header 1</th><th>Header 2</th></tr>
          <tr><td>Data 1</td><td>Data 2</td></tr>
        </table>`;
    makeMovable(container);
    document.getElementById('canvasWrapper').appendChild(container);
}

document.getElementById('imageInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
        const wrapper = document.createElement('div');
        wrapper.className = 'floating-image';
        wrapper.style.position = 'absolute';
        wrapper.style.left = '150px';
        wrapper.style.top = '150px';
        wrapper.style.resize = 'both';
        wrapper.style.overflow = 'auto';
        wrapper.style.padding = '5px';

        const delBtn = document.createElement('button');
        delBtn.textContent = '✖';
        delBtn.style.float = 'right';
        delBtn.style.cursor = 'pointer';
        delBtn.onclick = () => wrapper.remove();

        img.style.maxWidth = '100%';
        img.style.display = 'block';

        wrapper.appendChild(delBtn);
        wrapper.appendChild(img);
        makeMovable(wrapper);
        document.getElementById('canvasWrapper').appendChild(wrapper);
    };

    img.src = URL.createObjectURL(file);
});



document.getElementById('pdfInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
        const typedarray = new Uint8Array(reader.result);
        pdfjsLib.getDocument(typedarray).promise.then(pdf => {
            pdf.getPage(1).then(page => {
                const scale = 1.5;
                const viewport = page.getViewport({ scale });
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = viewport.width;
                tempCanvas.height = viewport.height;
                const tempCtx = tempCanvas.getContext('2d');

                page.render({ canvasContext: tempCtx, viewport }).promise.then(() => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'floating-pdf';
                    wrapper.style.position = 'absolute';
                    wrapper.style.left = '150px';
                    wrapper.style.top = '150px';
                    wrapper.style.resize = 'both';
                    wrapper.style.overflow = 'auto';
                    wrapper.style.padding = '5px';

                    const delBtn = document.createElement('button');
                    delBtn.textContent = '✖';
                    delBtn.style.float = 'right';
                    delBtn.style.cursor = 'pointer';
                    delBtn.onclick = () => wrapper.remove();

                    wrapper.appendChild(delBtn);
                    wrapper.appendChild(tempCanvas);
                    makeMovable(wrapper);
                    document.getElementById('canvasWrapper').appendChild(wrapper);
                });
            });
        });
    };
    reader.readAsArrayBuffer(file);
});

function clearCanvas() {
    if (confirm("Do you really want to delete the Canvas? This action cannot be undone")) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

async function exportAsPDF() {
    const wrapper = document.getElementById('canvasWrapper');

    // Wait for rendering the entire visible content
    const canvasImage = await html2canvas(wrapper, {
        scale: 2,            // higher quality
        useCORS: true,
        backgroundColor: '#ffffff' // force white background for PDF
    });

    const imgData = canvasImage.toDataURL('image/png');
    const { jsPDF } = window.jspdf;

    // PDF page size (in px)
    const pdf = new jsPDF('p', 'px', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Image size
    const imgWidth = canvasImage.width;
    const imgHeight = canvasImage.height;

    // Ratio for fitting width
    const ratio = pageWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;

    let position = 0;

    // Split into multiple pages
    while (position < scaledHeight) {
        pdf.addImage(
            imgData,
            'PNG',
            0,
            -position,
            pageWidth,
            scaledHeight
        );

        position += pageHeight;

        if (position < scaledHeight) {
            pdf.addPage();
        }
    }

    pdf.save('drawing.pdf');
}

function exportAsProject() {
    const elements = [];
    const wrapper = document.getElementById('canvasWrapper');
    wrapper.querySelectorAll('.floating-textbox, .floating-table').forEach(el => {
        elements.push({
            type: el.className,
            html: el.outerHTML,
            left: el.style.left,
            top: el.style.top,
            width: el.style.width,
            height: el.style.height
        });
    });

    const drawingData = canvas.toDataURL('image/png');

    const project = {
        drawing: drawingData,
        elements
    };

    const blob = new Blob([JSON.stringify(project)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'drawing_project.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importProject() {
    const input = document.getElementById('importFile');
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = JSON.parse(e.target.result);

        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = data.drawing;

        document.querySelectorAll('.floating-textbox, .floating-table').forEach(el => el.remove());

        data.elements.forEach(item => {
            const template = document.createElement('template');
            template.innerHTML = item.html.trim();
            const newEl = template.content.firstChild;
            newEl.style.left = item.left;
            newEl.style.top = item.top;
            newEl.style.width = item.width;
            newEl.style.height = item.height;
            makeMovable(newEl);
            document.getElementById('canvasWrapper').appendChild(newEl);
        });
    };
    reader.readAsText(file);
}

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.body.offsetHeight;

    // Trigger when near bottom (e.g., within 100px)
    if (scrollY + viewportHeight >= fullHeight - 100) {
        extendCanvas();
    }
});

function extendCanvas(extraHeight = 800) {
    // Create a temporary canvas to hold current content
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    // Resize the original canvas
    canvas.height += extraHeight;

    // Redraw previous content
    ctx.drawImage(tempCanvas, 0, 0);
}

const canvasWrapper = document.getElementById('canvasWrapper');

canvasWrapper.addEventListener('scroll', () => {
    const scrollY = canvasWrapper.scrollTop;
    const viewportHeight = canvasWrapper.clientHeight;
    const fullHeight = canvasWrapper.scrollHeight;

    if (scrollY + viewportHeight >= fullHeight - 100) {
        extendCanvas();
    }
});

let tool = 'pen'; // or 'eraser'

document.getElementById('eraserBtn').addEventListener('click', () => {
    tool = (tool === 'eraser') ? 'pen' : 'eraser';
});

if (undoStack.length > 50) undoStack.shift();


function undo() {
    if (undoStack.length === 0) return;
    const lastState = undoStack.pop();
    ctx.putImageData(lastState, 0, 0);
}

window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undo();
    }
});

