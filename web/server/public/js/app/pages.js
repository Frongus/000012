function addNewPage() {
    const wrapper = document.getElementById('canvasWrapper');

    const spacer = document.createElement('div');
    spacer.style.height = '20px';
    wrapper.appendChild(spacer);

    const newCanvas = document.createElement('canvas');
    newCanvas.width = 1240;
    newCanvas.height = 1754;
    newCanvas.className = 'pageCanvas';
    newCanvas.style.border = '1px solid var(--color-secondary)';
    wrapper.appendChild(newCanvas);

    initializeCanvas(newCanvas);

    const pageBtn = document.createElement('button');
    pageBtn.textContent = '+ Add Page';
    pageBtn.className = 'add-page-btn';
    pageBtn.onclick = addNewPage;
    wrapper.appendChild(pageBtn);
}
