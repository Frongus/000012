async function exportAsPDF() {
  const wrapper = document.getElementById('canvasWrapper');

  const canvasImage = await html2canvas(wrapper, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  });

  const imgData = canvasImage.toDataURL('image/png');
  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF('p', 'px', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = canvasImage.width;
  const imgHeight = canvasImage.height;
  const ratio = pageWidth / imgWidth;
  const scaledHeight = imgHeight * ratio;

  let position = 0;
  while (position < scaledHeight) {
    pdf.addImage(imgData, 'PNG', 0, -position, pageWidth, scaledHeight);
    position += pageHeight;
    if (position < scaledHeight) pdf.addPage();
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
  const project = { drawing: drawingData, elements };

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
