export function layoutEngine(
  items,
  containerWidth,
  cols = 3,
  mode = "design",
  gap = 10
) {
  const colWidth = (containerWidth - gap * (cols + 1)) / cols;

  const colHeights = new Array(cols).fill(0);

  const result = [];

  const getSpan = item => (item.type === "long" ? 2 : 1);

  const getHeight = item =>
    mode === "design" ? item.mockHeight : item.realHeight || item.mockHeight;

  const findBestCol = span => {
    let best = 0;
    let minH = Infinity;

    for (let i = 0; i <= cols - span; i++) {
      // ⭐关键修复：long 卡必须用 max，不是 min
      const h = Math.max(...colHeights.slice(i, i + span));

      if (h < minH) {
        minH = h;
        best = i;
      }
    }

    return best;
  };

  items.forEach(item => {
    if (item) {
      const span = getSpan(item);
      const col = findBestCol(span);

      // ⭐统一 baseline（关键）
      const baseTop = Math.max(...colHeights.slice(col, col + span));

      const top = baseTop === 0 ? gap : baseTop + gap;

      const height = getHeight(item);

      const width = colWidth * span + gap * (span - 1);

      const newH = top + height;

      // ⭐关键：锁定整组列
      for (let i = 0; i < span; i++) {
        colHeights[col + i] = newH;
      }

      result.push({
        ...item,
        span,
        top,
        left: col * (colWidth + gap) + gap,
        width,
        height
      });
    }
  });

  return result;
}
