// draw stroke based on strokeType
// the number of types is in STROKES
export function fillStroke(ctx, pos, color, type) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 30;
  ctx.setLineDash([]); // back to line

  switch (type) {
    case 1: // lines
      ctx.strokeRect(70, 70, 560, 560);
      break;
    case 2: // rounded
      drawRoundedRect(ctx, 55, 55, 590, 590, 30);
      break;
    case 3: // circle
      drawCircleBorder(ctx, pos, pos, 300);
      break;
    case 4: // heart
      drawHeartBorder(ctx, pos, 70, 550);
      break;
    case 5: // star
      drawStarBorder(ctx, pos, pos, 250, 300, 16);
      break;
  }
}

// fillStroke: case 2
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // clockwise
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);

  ctx.closePath();
  ctx.fill("evenodd");
}

// fillStroke: case 3
function drawCircleBorder(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
}

// fillStroke: case 4
function drawHeartBorder(ctx, x, y, size) {
  ctx.beginPath();
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.moveTo(x, y + size / 4);
  ctx.bezierCurveTo(
    x - size / 3,
    y - size / 3,
    x - size,
    y + size / 2,
    x,
    y + size
  );

  ctx.bezierCurveTo(
    x + size,
    y + size / 2,
    x + size / 3,
    y - size / 3,
    x,
    y + size / 4
  );

  ctx.closePath();
  ctx.fill("evenodd");
}

// fillStroke: case 5
function drawStarBorder(ctx, x, y, outerRadius, innerRadius, points) {
  ctx.beginPath();
  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const step = Math.PI / points;

  for (let i = 0; i < 2 * points; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step;

    const posX = x + Math.cos(angle) * radius;
    const posY = y + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(posX, posY);
    } else {
      ctx.lineTo(posX, posY);
    }
  }

  ctx.closePath();
  ctx.fill("evenodd");
}
