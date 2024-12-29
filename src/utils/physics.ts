import { Circle } from '../components/circle';

const groundFriction = 0.9; // Base horizontal friction when on the ground
const velocityThreshold = 0.1; // Base minimum velocity to stop horizontal motion

export function resolveCollision(circle1: Circle, circle2: Circle) {
  const dx = circle2.pos_x - circle1.pos_x;
  const dy = circle2.pos_y - circle1.pos_y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Push circles apart if they're overlapping
  const overlap = circle1.radius + circle2.radius - distance;
  if (overlap > 0) {
    const nx = dx / distance; // Normalized collision vector
    const ny = dy / distance;

    // Move circles apart proportionally to their radii
    circle1.pos_x -= (nx * overlap) / 2;
    circle1.pos_y -= (ny * overlap) / 2;
    circle2.pos_x += (nx * overlap) / 2;
    circle2.pos_y += (ny * overlap) / 2;

    // Reflect velocities to bounce
    const v1n = circle1.vec_x * nx + circle1.vec_y * ny; // Normal velocity of circle1
    const v2n = circle2.vec_x * nx + circle2.vec_y * ny; // Normal velocity of circle2

    // Swap normal velocities (elastic collision)
    const v1nAfter = v2n;
    const v2nAfter = v1n;

    // Tangential components remain unchanged
    const tx = -ny; // Tangential vector
    const ty = nx;

    const v1t = circle1.vec_x * tx + circle1.vec_y * ty;
    const v2t = circle2.vec_x * tx + circle2.vec_y * ty;

    // Recalculate velocities
    circle1.vec_x = v1nAfter * nx + v1t * tx;
    circle1.vec_y = v1nAfter * ny + v1t * ty;
    circle2.vec_x = v2nAfter * nx + v2t * tx;
    circle2.vec_y = v2nAfter * ny + v2t * ty;

    // Normalize to keep constant speed
    circle1.normalizeVelocity();
    circle2.normalizeVelocity();
  }
}

export const handleGroundBounce = (
  c: Circle,
  ctx: CanvasRenderingContext2D
) => {
  // Ground bounce
  if (c.pos_y + c.vec_y + c.radius > ctx.canvas.height) {
    if (Math.abs(c.vec_y) < c.radius / 2) {
      // Stop oscillation
      c.vec_y = 0;
      c.pos_y = ctx.canvas.height - c.radius;

      // Slow down horizontal motion
      if (Math.abs(c.vec_x) < velocityThreshold) {
        c.vec_x = 0;
      } else {
        c.vec_x *= groundFriction;
      }
    } else {
      // Standard bounce with energy loss
      c.vec_y *= -0.8;
      c.pos_y = ctx.canvas.height - c.radius;
    }
  }
};

export const handleCeilingBounce = (c: Circle) => {
  // Ceiling bounce
  if (c.pos_y + c.vec_y - c.radius < 0) {
    if (Math.abs(c.vec_y) < c.radius / 2) {
      // Stop oscillation
      c.vec_y = 0;
      c.pos_y = c.radius;

      // Slow down horizontal motion
      if (Math.abs(c.vec_x) < velocityThreshold) {
        c.vec_x = 0;
      } else {
        c.vec_x *= groundFriction;
      }
    } else {
      // Standard bounce with energy loss
      c.vec_y *= -0.8;
      c.pos_y = c.radius;
    }
  }
};

export const handleWallsBounce = (c: Circle, ctx: CanvasRenderingContext2D) => {
  // Bounce off the walls
  if (c.pos_x - c.radius < 0 || c.pos_x + c.radius > ctx.canvas.width) {
    c.vec_x *= -1; // Reverse direction
  }
};
