import { usePlayerVolumeContext } from 'app/film-database/components/iframe/iframe-controller/context/PlayerVolumeContext';
import { useRef } from 'react';
import type { MouseEvent } from 'react';

const IFrameControllerVolumeSlider = () => {
  const { setPlayerVolume } = usePlayerVolumeContext();
  const sliderRef = useRef<HTMLButtonElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);
  const isDragging = useRef<boolean>(false);

  const moveHandle = (e: MouseEvent<HTMLButtonElement>) => {
    if (!sliderRef.current || !handleRef.current) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const xOffset = e.clientX - sliderRect.left;
    const position = (xOffset / sliderRect.width) * 100;
    const clampedPosition = Math.min(100, Math.max(0, position));

    handleRef.current.style.left = `${clampedPosition}%`;
    setPlayerVolume(clampedPosition);
  };

  return (
    <button
      className='fdiFrame__controller__controls__slider'
      aria-label='Volume adjustment slider'
      ref={sliderRef}
      onPointerDown={() => (isDragging.current = true)}
      onPointerMove={(e) => {
        if (isDragging.current) moveHandle(e);
      }}
      onClick={(e) => {
        moveHandle(e);
        isDragging.current = false;
      }}
      onPointerLeave={() => (isDragging.current = false)}>
      <span className='fdiFrame__controller__controls__slider--range' />
      <span
        className='fdiFrame__controller__controls__slider--handle'
        aria-label='Volume adjustment knob'
        ref={handleRef}
        style={{ left: '0%' }}
      />
    </button>
  );
};

export default IFrameControllerVolumeSlider;
