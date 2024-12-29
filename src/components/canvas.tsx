import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { gravityAtom } from '../atoms/gravity-atom';
import { Circle } from './circle';
import { getRandomBrightColor } from '../utils/colors';
import { areCirclesIntersecting, isMouseOverCircle } from '../utils/checks';
import {
  handleCeilingBounce,
  handleGroundBounce,
  handleWallsBounce,
  resolveCollision,
} from '../utils/physics';
import { circlesAtom } from '../atoms/cicrles-atom';

let frameCount = 0;
let nextRadius = Math.random() * 20 + 10;
let nextColor = getRandomBrightColor();
let mPos: number[] = [];
// let circles: Circle[] = [];

export const Canvas = (props: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gravity] = useAtom(gravityAtom);
  const [circles, setCircles] = useAtom(circlesAtom);
  let frame = 0;

  const draw = useCallback(
    (_: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.strokeStyle = '#ddd';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(ctx.canvas.width, 0);
        ctx.moveTo(0, ctx.canvas.height);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
        ctx.stroke();

        ctx.fillStyle = '#000000';
        circles.forEach((c) => {
          c.vec_y += gravity;

          handleWallsBounce(c, ctx);

          handleGroundBounce(c, ctx);

          handleCeilingBounce(c);

          c.pos_x += c.vec_x;
          c.pos_y += c.vec_y;

          c.drawCircle(ctx, 12);
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
          ctx.fillStyle = nextColor;
          ctx.fill();
          ctx.closePath();
        }
      }

      frame++;
    },
    [circles, gravity]
  );

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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      const index = isMouseOverCircle(e.nativeEvent, circles);
      console.log(index);
      if (index > -1) {
        circles[index].vec_x = Math.random() * 10 - 1;
        circles[index].vec_y = Math.random() * 10 - 1;
      } else {
        setCircles([
          ...circles,
          new Circle(e.nativeEvent, nextRadius, nextColor),
        ]);

        nextColor = getRandomBrightColor();
        nextRadius = Math.random() * 20 + 10;
      }
    },
    [circles]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      let circleIndex = isMouseOverCircle(e.nativeEvent, circles);

      if (canvasRef.current) {
        if (circleIndex > -1) {
          canvasRef.current.style.cursor = 'pointer';
          mPos = [];
        } else {
          canvasRef.current.style.cursor = 'default';
          mPos = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
        }
      }
    },
    [circles]
  );

  return (
    <canvas
      onMouseMove={handleMouseMove}
      onMouseOut={() => {
        mPos = [];
      }}
      onMouseDown={handleMouseDown}
      width={'100%'}
      height={'100%'}
      ref={canvasRef}
      {...props}
    />
  );
};
