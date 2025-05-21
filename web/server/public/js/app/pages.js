function addNewPage() {
    const wrapper = document.getElementById('canvasWrapper');

    // Optional spacing between pages
    const spacer = document.createElement('div');
    spacer.style.height = '20px';
    wrapper.appendChild(spacer);

    // Create a container for canvas + button
    const container = document.createElement('div');
    container.className = 'canvasPageContainer';
    container.style.position = 'relative';
    container.style.display = 'inline-block';

    // Create the canvas
    const newCanvas = document.createElement('canvas');
    newCanvas.width = 1240;
    newCanvas.height = 1754;
    newCanvas.className = 'pageCanvas';
    newCanvas.style.border = '1px solid var(--color-secondary)';
    newCanvas.style.backgroundColor = '#fff';
    container.appendChild(newCanvas);

    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = '✕';
    deleteBtn.title = 'Delete Page';
    deleteBtn.className = 'btnSecondary';
    deleteBtn.style.position = 'absolute';
    deleteBtn.style.top = '8px';
    deleteBtn.style.right = '8px';
    deleteBtn.onclick = () => {
        if (confirm('Delete this page?')) {
            wrapper.removeChild(spacer);
            wrapper.removeChild(container);
        }
    };

    container.appendChild(deleteBtn);
    wrapper.appendChild(container);

    initializeCanvas(newCanvas);
}
