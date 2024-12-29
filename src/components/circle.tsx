// type Circle = {
//   id: number;
//   pos_x: number;
//   pos_y: number;
//   vec_x: number;
//   vec_y: number;
//   radius: number;
//   color: string;
// };

let circlesCount = 0;

export class Circle {
  public id: number;
  public pos_x: number;
  public pos_y: number;
  public vec_x: number;
  public vec_y: number;
  public radius: number;
  public color: string;

  constructor(event: MouseEvent, radius: number, color: string) {
    this.id = circlesCount++;
    console.log(circlesCount);
    this.vec_x = Math.random() * 4 - 2;
    this.vec_y = Math.random() * 4 - 2;

    this.pos_x = event.offsetX;
    this.pos_y = event.offsetY;

    this.radius = radius;
    this.color = color;
  }

  isMouseOverCircle(mouse: MouseEvent) {
    const dist = Math.sqrt(
      (mouse.offsetX - this.pos_x) ** 2 + (mouse.offsetY - this.pos_y) ** 2
    );

    if (dist <= this.radius) {
      return this.id;
    }

    return -1;
  }

  normalizeVelocity() {
    const speed = Math.sqrt(this.vec_x * this.vec_x + this.vec_y * this.vec_y);
    const desiredSpeed = 2; // Adjust as needed for constant speed
    this.vec_x = (this.vec_x / speed) * desiredSpeed;
    this.vec_y = (this.vec_y / speed) * desiredSpeed;
  }

  drawCircle(ctx: CanvasRenderingContext2D, vectorDrawScale = 0) {
    ctx.beginPath();
    // frameCount * 0.05 +
    ctx.arc(this.pos_x, this.pos_y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color; // Set the color
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(this.pos_x, this.pos_y); // Start at the circle's center
    ctx.lineTo(
      this.pos_x + this.vec_x * vectorDrawScale, // End at the vector's direction
      this.pos_y + this.vec_y * vectorDrawScale
    );
    ctx.strokeStyle = 'red'; // Set a distinct color for the vector
    ctx.lineWidth = 2; // Set line thickness
    ctx.stroke();
    ctx.closePath();

    const startX = this.pos_x;
    const startY = this.pos_y;
    const endX = this.pos_x + this.vec_x * vectorDrawScale;
    const endY = this.pos_y + this.vec_y * vectorDrawScale;

    const magnitude = Math.sqrt(
      this.vec_x * this.vec_x + this.vec_y * this.vec_y
    );

    // Calculate the arrowhead
    const arrowLength = (8 * magnitude) / 2; // Length of the arrowhead

    // Angle of the vector
    const angle = Math.atan2(endY - startY, endX - startX);

    // Points for the arrowhead
    const arrowPoint1X = endX - arrowLength * Math.cos(angle - Math.PI / 6);
    const arrowPoint1Y = endY - arrowLength * Math.sin(angle - Math.PI / 6);
    const arrowPoint2X = endX - arrowLength * Math.cos(angle + Math.PI / 6);
    const arrowPoint2Y = endY - arrowLength * Math.sin(angle + Math.PI / 6);

    if (magnitude) {
      // Draw the arrowhead
      ctx.beginPath();
      ctx.moveTo(endX, endY); // Tip of the arrow
      ctx.lineTo(arrowPoint1X, arrowPoint1Y); // Left side
      ctx.lineTo(arrowPoint2X, arrowPoint2Y); // Right side
      ctx.closePath();
      ctx.fillStyle = 'red';
      ctx.fill();
    }
  }
}
