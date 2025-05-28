(function () {
  window.zoomState = {
    scale: 1,
    translateX: 0,
    translateY: 0,
    lastDistance: null,
    lastTouchMid: null,
    isZooming: false,
  };

  function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getTouchMidpoint(touches) {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  }

  window.handleZoomTouchStart = function (e) {
    if (e.touches.length === 2) {
      zoomState.isZooming = true;
      zoomState.lastDistance = getTouchDistance(e.touches);
      zoomState.lastTouchMid = getTouchMidpoint(e.touches);
    }
  };

  window.handleZoomTouchMove = function (e, redrawCallback) {
    if (e.touches.length === 2 && zoomState.isZooming) {
      e.preventDefault();

      const newDistance = getTouchDistance(e.touches);
      const newMid = getTouchMidpoint(e.touches);
      const deltaScale = newDistance / zoomState.lastDistance;

      zoomState.scale *= deltaScale;
      zoomState.scale = Math.max(0.5, Math.min(zoomState.scale, 5)); // clamp

      zoomState.translateX += newMid.x - zoomState.lastTouchMid.x;
      zoomState.translateY += newMid.y - zoomState.lastTouchMid.y;

      zoomState.lastDistance = newDistance;
      zoomState.lastTouchMid = newMid;

      if (typeof redrawCallback === 'function') redrawCallback();
    }
  };

  window.handleZoomTouchEnd = function () {
    zoomState.isZooming = false;
    zoomState.lastDistance = null;
    zoomState.lastTouchMid = null;
  };
})();
