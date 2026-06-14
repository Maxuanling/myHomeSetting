export function layoutEngine(items, containerWidth, cols = 3, mode = "design", gap = 10) {

  // ⭐扣掉左右 padding + gap
  const colWidth = (containerWidth - gap * (cols + 1)) / cols;

  const colHeights = new Array(cols).fill(0);

  const result = [];

  const getSpan = (item) => item.type === "long" ? 2 : 1;

  const getHeight = (item) => {
    return mode === "design"
      ? item.mockHeight
      : item.realHeight || item.mockHeight;
  };

  const findBestCol = (span) => {
    let best = 0;
    let minH = Infinity;

    for (let i = 0; i <= cols - span; i++) {
      const h = Math.min(...colHeights.slice(i, i + span));

      if (h < minH) {
        minH = h;
        best = i;
      }
    }

    return best;
  };

  items.forEach(item => {

    const span = getSpan(item);
    const col = findBestCol(span);

    const baseTop = Math.min(...colHeights.slice(col, col + span));

    // ⭐top统一加gap
    const top = baseTop === 0 ? gap : baseTop + gap;

    const height = getHeight(item);

    const width = colWidth * span + gap * (span - 1);

    const newHeight = top + height;

    for (let i = 0; i < span; i++) {
      colHeights[col + i] = newHeight;
    }

    result.push({
      ...item,
      span,
      top,
      left: col * (colWidth + gap) + gap,
      width,
      height
    });

  });

  return result;
}