export const drawGrid = (ctx: CanvasRenderingContext2D, gridSpacing = 50) => {
  // Draw vertical and horizontal grid lines
  for (let x = 0; x <= ctx.canvas.width; x += gridSpacing) {
    for (let y = 0; y <= ctx.canvas.height; y += gridSpacing) {
      // Draw position ID
      const posId = `(${x}, ${y})`;
      ctx.fillStyle = 'black';
      ctx.fillText(posId, x + 4, y + 4);

      // Draw grid lines
      ctx.strokeStyle = '#ddd';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  }
};
