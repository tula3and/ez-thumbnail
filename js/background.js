// fill background
// with one color or an image
export function fillBackground(ctx, canvas, size, color, imgBase64, blur) {
  ctx.clearRect(0, 0, size, size);

  if (imgBase64 !== null) {
    const img = new Image();
    img.src = imgBase64;
    fillImage(ctx, canvas, img, blur);
  } else {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
  }
}

// fill with uploaded image
function fillImage(ctx, canvas, img, blur) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imgWidth = img.width;
  const imgHeight = img.height;
  const imgAspectRatio = imgWidth / imgHeight; // image width:height ratio
  const canvasAspectRatio = canvasWidth / canvasHeight;

  let srcX, srcY, srcWidth, srcHeight;

  if (imgAspectRatio > canvasAspectRatio) {
    // the image is wider than canvas
    srcHeight = imgHeight;
    srcWidth = imgHeight * canvasAspectRatio;
    srcX = (imgWidth - srcWidth) / 2; // cut both sides
    srcY = 0;
  } else {
    srcWidth = imgWidth;
    srcHeight = imgWidth / canvasAspectRatio;
    srcX = 0;
    srcY = (imgHeight - srcHeight) / 2;
  }

  if (blur) {
    ctx.filter = "blur(10px)";
  }

  ctx.drawImage(
    img,
    srcX,
    srcY,
    srcWidth,
    srcHeight, // cropped image (x, y, width, height)
    0,
    0,
    canvasWidth,
    canvasHeight // canvas area
  );

  ctx.filter = "none";
}
