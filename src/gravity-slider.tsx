import { ChangeEventHandler } from 'react';
import { gravityAtom } from './atoms/gravity-atom';
import { useAtom } from 'jotai';

export const GravitySlider = ({ min = -0.1, max = 0.1, step = 0.001 }) => {
  const [gravity, setGravity] = useAtom(gravityAtom);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setGravity(Number(e.target.value));
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={gravity}
          onChange={handleChange}
          style={{
            width: '300px',
            direction: 'ltr',
            transform: 'scaleX(1)',
          }}
        />
      </div>
      <div style={{ marginTop: '10px', fontSize: '16px' }}>
        Gravity: {gravity}
      </div>
    </div>
  );
};
