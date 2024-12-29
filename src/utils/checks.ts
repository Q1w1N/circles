import { Circle } from '../components/circle';

export const areCirclesIntersecting = (c1: Circle, c2: Circle) => {
  const dx = c2.pos_x - c1.pos_x; // Difference in x
  const dy = c2.pos_y - c2.pos_y; // Difference in y
  const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance

  // Check if the circles are intersecting
  return distance <= c1.radius + c2.radius;
};

export const isMouseOverCircle = (mouse: MouseEvent, circles: Circle[]) => {
  for (const circle of circles) {
    const hovering = circle.isMouseOverCircle(mouse);

    if (hovering > -1) {
      return hovering;
    }
  }

  return -1;
};
