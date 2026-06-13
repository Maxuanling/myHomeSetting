export function layoutEngine(items, containerWidth, cols = 3) {

  const colWidth = containerWidth / cols;

  const colHeights = new Array(cols).fill(0);

  const result = [];

  const getSpan = (item) => item.type === "long" ? 2 : 1;

  const getHeight = (item, containerWidth) => {
    // ⭐统一高度体系（解决2倍问题关键）
    return item.heightRatio * containerWidth;
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

    const top = Math.min(...colHeights.slice(col, col + span));

    const height = getHeight(item, containerWidth);
    const width = colWidth * span;

    const newH = top + height;

    for (let i = 0; i < span; i++) {
      colHeights[col + i] = newH;
    }

    result.push({
      ...item,
      span,
      top,
      left: col * colWidth,
      width,
      height
    });

  });

  return result;
}