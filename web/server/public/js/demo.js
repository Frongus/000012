const draggables = document.querySelectorAll('.draggable');

  draggables.forEach(el => {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    // Mouse events
    el.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - el.offsetLeft;
      offsetY = e.clientY - el.offsetTop;
      el.style.zIndex = 1000;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      el.style.left = (e.clientX - offsetX) + 'px';
      el.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      el.style.zIndex = '';
    });

    // Touch events
    el.addEventListener('touchstart', (e) => {
      isDragging = true;
      const touch = e.touches[0];
      offsetX = touch.clientX - el.offsetLeft;
      offsetY = touch.clientY - el.offsetTop;
      el.style.zIndex = 1000;
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      el.style.left = (touch.clientX - offsetX) + 'px';
      el.style.top = (touch.clientY - offsetY) + 'px';
    });

    document.addEventListener('touchend', () => {
      isDragging = false;
      el.style.zIndex = '';
    });
  });