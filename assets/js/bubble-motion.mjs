export function calculateAttraction({ originX, originY, pointerX, pointerY, limit, divisor = 14 }) {
  const dx = pointerX - originX;
  const dy = pointerY - originY;
  const distance = Math.hypot(dx, dy);

  if (distance === 0) {
    return { x: 0, y: 0 };
  }

  const travel = Math.min(limit, distance / divisor);
  return {
    x: (dx / distance) * travel,
    y: (dy / distance) * travel,
  };
}

export function createBubbleMotion(surface, elements, { reducedMotion = false } = {}) {
  if (reducedMotion || !surface || elements.length === 0) {
    return () => {};
  }

  const state = elements.map((element) => ({
    element,
    limit: Number(element.dataset.limit),
    ease: Number(element.dataset.ease),
    phase: Number(element.dataset.phase),
    targetX: 0,
    targetY: 0,
    x: 0,
    y: 0,
    renderX: 0,
    renderY: 0,
  }));

  let frame = 0;
  let running = true;
  let visible = true;

  const point = (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') {
      return;
    }

    for (const bubble of state) {
      const rect = bubble.element.getBoundingClientRect();
      const result = calculateAttraction({
        originX: rect.left + rect.width / 2 - bubble.renderX,
        originY: rect.top + rect.height / 2 - bubble.renderY,
        pointerX: event.clientX,
        pointerY: event.clientY,
        limit: bubble.limit,
      });
      bubble.targetX = result.x;
      bubble.targetY = result.y;
    }
  };

  const reset = () => {
    state.forEach((bubble) => {
      bubble.targetX = 0;
      bubble.targetY = 0;
    });
  };

  const draw = (time) => {
    if (!running || !visible) {
      return;
    }

    for (const bubble of state) {
      bubble.x += (bubble.targetX - bubble.x) * bubble.ease;
      bubble.y += (bubble.targetY - bubble.y) * bubble.ease;
      bubble.renderX = bubble.x;
      bubble.renderY = bubble.y + Math.sin(time / 1900 + bubble.phase) * 2.2;
      bubble.element.style.setProperty('--bubble-x', `${bubble.renderX.toFixed(2)}px`);
      bubble.element.style.setProperty('--bubble-y', `${bubble.renderY.toFixed(2)}px`);
    }

    frame = requestAnimationFrame(draw);
  };

  surface.addEventListener('pointermove', point);
  surface.addEventListener('pointerleave', reset);

  const observer = typeof globalThis.IntersectionObserver === 'function'
    ? new globalThis.IntersectionObserver(([entry]) => {
        const nextVisible = entry?.isIntersecting ?? true;
        if (nextVisible && !visible) {
          visible = true;
          frame = requestAnimationFrame(draw);
        }
        if (!nextVisible) {
          visible = false;
        }
      })
    : null;

  observer?.observe(surface);
  frame = requestAnimationFrame(draw);

  return () => {
    running = false;
    cancelAnimationFrame(frame);
    observer?.disconnect();
    surface.removeEventListener('pointermove', point);
    surface.removeEventListener('pointerleave', reset);
  };
}
