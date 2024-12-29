import { useRef } from 'react';
import { Canvas } from './canvas';
import { GravitySlider } from './gravity-slider';

export function Dashboard() {
  const parent = useRef(null);
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GravitySlider />
      <div ref={parent} style={{ width: '100%', height: '80%' }}>
        <Canvas parent={parent} />
      </div>
    </div>
  );
}
