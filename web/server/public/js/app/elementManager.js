function makeMovable(el) {
    let offsetX = 0, offsetY = 0, isDragging = false;

    el.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'TD' || e.target.tagName === 'TH') return;
        isDragging = true;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const wrapperRect = document.getElementById('canvasWrapper').getBoundingClientRect();
        let newX = e.pageX - wrapperRect.left - offsetX;
        let newY = e.pageY - wrapperRect.top - offsetY;

        newX = Math.max(0, Math.min(newX, wrapperRect.width - el.offsetWidth));
        newY = Math.max(0, Math.min(newY, wrapperRect.height - el.offsetHeight));

        el.style.left = `${newX}px`;
        el.style.top = `${newY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function addTextbox() {
    const box = document.createElement('div');
    box.className = 'floating-textbox';
    box.style.left = '100px';
    box.style.top = '100px';

    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    delBtn.onclick = () => box.remove();

    const textarea = document.createElement('textarea');
    textarea.rows = 4;
    textarea.cols = 20;

    box.appendChild(delBtn);
    box.appendChild(textarea);
    makeMovable(box);
    document.getElementById('canvasWrapper').appendChild(box);
}

function addTable() {
    const tableBox = document.createElement('div');
    tableBox.className = 'floating-table';
    tableBox.style.left = '200px';
    tableBox.style.top = '200px';

    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    delBtn.onclick = () => tableBox.remove();

    const table = document.createElement('table');
    table.contentEditable = true;
    table.innerHTML = `<tr><th>Header 1</th><th>Header 2</th></tr><tr><td>Data 1</td><td>Data 2</td></tr>`;

    tableBox.appendChild(delBtn);
    tableBox.appendChild(table);
    makeMovable(tableBox);
    document.getElementById('canvasWrapper').appendChild(tableBox);
}
