import { IMousePosition } from '@croco/../libs/croco-common-interfaces';

export function drawWithPen(
  ctx: CanvasRenderingContext2D,
  res: IMousePosition,
  color: string,
  range: number
) {
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.moveTo(res.from.x, res.from.y);
  ctx.lineTo(res.to.x, res.to.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = range;
  ctx.stroke();
}

export function drawWithBrush(
  ctx: CanvasRenderingContext2D,
  res: IMousePosition,
  color: string,
  range: number
) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.lineCap = 'round';
  ctx.ellipse(res.from.x, res.from.y, range, range + 5, 75, 0, 2 * Math.PI);
  ctx.fill();
}

export function drawWithEraser(
  ctx: CanvasRenderingContext2D,
  res: IMousePosition,
  range: number
) {
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.moveTo(res.from.x, res.from.y);
  ctx.lineTo(res.to.x, res.to.y);
  ctx.strokeStyle = '#FFF';
  ctx.lineWidth = range + 5;
  ctx.stroke();
}

export function drawWithFloodFill(
  ctx: CanvasRenderingContext2D,
  res: { x: number; y: number },
  fillColor: string
) {
  const color = 255;
  const borderColor = 255;
  const imageData = ctx.getImageData(0, 0, 500, 500);
  const width = imageData.width;
  const height = imageData.height;
  const stack = [[res.x, res.y]];
  let pixel;
  let point = 0;
  while (stack.length > 0) {
    pixel = stack.pop() || [0, 0];
    if (pixel[0] < 0 || pixel[0] >= width) continue;
    if (pixel[1] < 0 || pixel[1] >= height) continue;

    point = pixel[1] * 4 * width + pixel[0] * 4 + 3;

    if (
      imageData.data[point] != borderColor &&
      imageData.data[point] != color
    ) {
      imageData.data[point] = color;
      imageData.data[point + 1] = parseInt(fillColor.substring(1, 3), 16);
      imageData.data[point + 2] = parseInt(fillColor.substring(3, 5), 16);
      imageData.data[point + 3] = parseInt(fillColor.substring(5, 7), 16);

      stack.push([pixel[0] - 1, pixel[1]]);
      stack.push([pixel[0] + 1, pixel[1]]);
      stack.push([pixel[0], pixel[1] - 1]);
      stack.push([pixel[0], pixel[1] + 1]);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, 500, 500);
}

export function saveCanvas(canvas: HTMLCanvasElement) {
  const link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.remove;
}
