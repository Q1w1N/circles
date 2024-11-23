import { useCallback, useEffect, useRef } from 'react';

let frameCount = 0;
let nextRadius = Math.random() * 20;
let mPos: number[] = [];
let circles: Circle[] = [];

type Circle = {
  id: number;
  pos_x: number;
  pos_y: number;
  vec_x: number;
  vec_y: number;
  radius: number;
};

function normalizeVelocity(circle: Circle) {
  const speed = Math.sqrt(
    circle.vec_x * circle.vec_x + circle.vec_y * circle.vec_y
  );
  const desiredSpeed = 2; // Adjust as needed for constant speed
  circle.vec_x = (circle.vec_x / speed) * desiredSpeed;
  circle.vec_y = (circle.vec_y / speed) * desiredSpeed;
}
function resolveCollision(circle1: Circle, circle2: Circle) {
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
    normalizeVelocity(circle1);
    normalizeVelocity(circle2);
  }
}

function areCirclesIntersecting(c1: Circle, c2: Circle) {
  const dx = c2.pos_x - c1.pos_x; // Difference in x
  const dy = c2.pos_y - c2.pos_y; // Difference in y
  const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance

  // Check if the circles are intersecting
  return distance <= c1.radius + c2.radius;
}

const drawPulsingCircle = (
  context: CanvasRenderingContext2D,
  circle: Circle
) => {
  context.beginPath();
  // frameCount * 0.05 +
  context.arc(circle.pos_x, circle.pos_y, circle.radius, 0, 2 * Math.PI);
  context.fill();
  context.closePath();
};

export const Canvas = (props: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let frame = 0;

  const draw = useCallback((frameCount: number) => {
    const canvas = canvasRef.current;
    const gridSpacing = 50;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

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

      ctx.fillStyle = '#000000';
      circles.forEach((c) => {
        // Bounce off the walls
        if (c.pos_x - c.radius < 0 || c.pos_x + c.radius > ctx.canvas.width) {
          c.vec_x *= -1; // Reverse direction
        }
        if (c.pos_y - c.radius < 0 || c.pos_y + c.radius > ctx.canvas.height) {
          c.vec_y *= -1; // Reverse direction
        }

        c.pos_x += c.vec_x;
        c.pos_y += c.vec_y;

        drawPulsingCircle(ctx, c);
      });

      // Check for collisions and resolve them
      for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
          if (areCirclesIntersecting(circles[i], circles[j])) {
            resolveCollision(circles[i], circles[j]);
          }
        }
      }

      if (mPos.length > 1) {
        ctx.beginPath();
        ctx.arc(mPos[0], mPos[1], nextRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
      }
    }

    frame++;
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const width = canvasRef.current?.parentElement?.clientWidth ?? 0;
      const height = canvasRef.current?.parentElement?.clientHeight ?? 0;

      if (canvas.width !== width || canvas.height !== height) {
        circles.forEach((circle) => {
          if (circle.pos_x + circle.radius >= width) {
            circle.pos_x = width - circle.radius;
            circle.vec_x *= -1;
          }

          if (circle.pos_y + circle.radius >= height) {
            circle.pos_y = height - circle.radius;
            circle.vec_y *= -1;
          }
        });

        canvas.width = width;
        canvas.height = height;
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    let animationFrameId: number;

    //Our draw came here
    const render = () => {
      resizeCanvas();
      frameCount++;
      draw(frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  useEffect(() => {
    const x = setInterval(() => {
      console.log(frame);
      frame = 0;
    }, 1000);

    return () => {
      clearTimeout(x);
    };
  }, []);

  return (
    <canvas
      onMouseMove={(e) => {
        mPos = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
      }}
      onMouseOut={() => {
        mPos = [];
      }}
      onMouseDown={(e) => {
        circles.push({
          id: circles.length,
          pos_x: e.nativeEvent.offsetX,
          pos_y: e.nativeEvent.offsetY,
          radius: nextRadius,
          vec_x: Math.random() * 4 - 2,
          vec_y: Math.random() * 4 - 2,
        });
        nextRadius = Math.random() * 20;
      }}
      width={'100%'}
      height={'100%'}
      ref={canvasRef}
      {...props}
    />
  );
};
