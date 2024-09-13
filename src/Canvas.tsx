import { useCallback, useEffect, useRef } from 'react';

let frameCount = 0;
let mPos: number[] = [];
let circles: number[][] = [];

const drawPulsingCircle = (
  context: CanvasRenderingContext2D,
  pos: number[]
) => {
  if (pos.length > 1) {
    context.beginPath();
    // frameCount * 0.05 +
    context.arc(pos[0], pos[1], 20 * Math.sin(pos[2]) ** 2, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }
};

export const Canvas = (props: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback((frameCount: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.fillStyle = '#000000';
      circles.forEach((circle) => {
        drawPulsingCircle(context, circle);
        if (circle[0] + circle[2] > context.canvas.width && circle[3] === 1) {
          circle[3] = 0;
        }
        if (circle[0] + circle[2] < 0 && circle[3] === 0) {
          circle[3] = 1;
        }
        if (circle[3]) {
          circle[0] = circle[0] + circle[2];
        } else {
          circle[0] = circle[0] - circle[2];
        }
      });

      if (mPos.length > 1) {
        context.beginPath();
        context.arc(mPos[0], mPos[1], 20, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
      }
    }
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const width = canvasRef.current?.parentElement?.clientWidth ?? 0;
      const height = canvasRef.current?.parentElement?.clientHeight ?? 0;

      if (canvas.width !== width || canvas.height !== height) {
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

  return (
    <canvas
      onMouseMove={(e) => {
        mPos = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
      }}
      onMouseOut={() => {
        mPos = [];
      }}
      onMouseDown={(e) => {
        circles.push([
          e.nativeEvent.offsetX,
          e.nativeEvent.offsetY,
          Math.random() * 3,
          1,
        ]);
      }}
      width={'100%'}
      height={'100%'}
      ref={canvasRef}
      {...props}
    />
  );
};
