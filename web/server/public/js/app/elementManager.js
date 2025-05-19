function makeMovable(el) {
  let offsetX = 0, offsetY = 0, isDown = false;

  el.addEventListener('mousedown', (e) => {
    if (['TEXTAREA', 'TD', 'TH'].includes(e.target.tagName)) return;
    isDown = true;

    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    el.style.zIndex = 1000;
    e.preventDefault();
  });
  

  document.addEventListener('mousemove', (e) => {
    if (!isDown) return;

    // Get wrapper bounds (not canvas bounds)
    const wrapperRect = canvasWrapper.getBoundingClientRect();

    let newLeft = e.clientX - wrapperRect.left - offsetX;
    let newTop = e.clientY - wrapperRect.top - offsetY;

    const maxLeft = canvasWrapper.offsetWidth - el.offsetWidth;
    const maxTop = canvasWrapper.offsetHeight - el.offsetHeight;

    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    el.style.left = `${newLeft}px`;
    el.style.top = `${newTop}px`;
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    el.style.zIndex = '';
  });
}



function addTextbox() {
    const textbox = document.createElement('div');
    textbox.className = 'floating-textbox';
    textbox.style.left = `${Math.min(canvas.width - 200, 100)}px`;
    textbox.style.top = `${Math.min(canvas.height - 100, 100)}px`;

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
    container.innerHTML = `<table contenteditable="true">
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
        wrapper.style.left = '150px';
        wrapper.style.top = '150px';

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
                    wrapper.style.left = '150px';
                    wrapper.style.top = '150px';

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
