const toolbar = document.getElementById('toolbar');
  const toggleBtn = document.getElementById('toolbarToggle');

  toggleBtn.addEventListener('click', () => {
    toolbar.classList.toggle('active');
  });