import { useRef } from 'react';
import { Canvas } from './canvas';

export function App() {
  const parent = useRef(null);
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div ref={parent} style={{ width: '100%', height: '100%' }}>
        <Canvas parent={parent} />
      </div>
    </div>
  );
}
