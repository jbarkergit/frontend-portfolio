import { useEffect, useRef, useState } from 'react';
import type { YouTubePlayer } from 'react-youtube';

const IFrameControllerSeeker = ({ player }: { player: YouTubePlayer }) => {
  const isInteract = useRef<boolean>(false);
  const isDragging = useRef<boolean>(false);
  const [dragPos, setDragPos] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const seekerRef = useRef<HTMLButtonElement>(null);

  const seek = async (travelDistance: number): Promise<void> => {
    if (!seekerRef.current) return;
    const duration = await player.getDuration();
    const sliderWidth: number = seekerRef.current.clientWidth;
    const ratio: number = travelDistance / sliderWidth;
    const seekTime: number = Math.max(0, Math.min(ratio * duration, duration));
    await player.seekTo(seekTime, true);
  };

  const slide = async (e: React.PointerEvent<HTMLButtonElement>): Promise<void> => {
    if (seekerRef.current && isDragging.current) {
      const seekerRect: DOMRect = seekerRef.current.getBoundingClientRect();
      const xOffset: number = e.clientX - seekerRect.left;
      setDragPos(xOffset);
      await seek(xOffset);
    }
  };

  // Poll and update current time
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const currentTime = await player.getCurrentTime();
      setTime(currentTime);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [player]);

  // Update seeker position when not interacting
  useEffect(() => {
    const autoSeek = async () => {
      if (!seekerRef.current || isDragging.current) return;
      const sliderWidth: number = seekerRef.current.clientWidth;
      const offset: number = (time / (await player.getDuration())) * sliderWidth;
      setDragPos(offset);
    };

    autoSeek();
  }, [player, time]);

  // Reset seeker when player changes
  useEffect(() => setDragPos(0), [player]);

  return (
    <button
      className='fdiFrame__controller__seeker'
      aria-label='Video time seeker'
      ref={seekerRef}
      onPointerDown={() => {
        isInteract.current = true;
        isDragging.current = true;
      }}
      onPointerMove={async (e) => {
        if (isInteract.current && isDragging.current) {
          await slide(e);
        }
      }}
      onPointerUp={async (e) => {
        if (isInteract.current) {
          await slide(e);
        }
        isInteract.current = false;
        isDragging.current = false;
      }}
      onPointerLeave={() => {
        isInteract.current = false;
        isDragging.current = false;
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      <span className='fdiFrame__controller__seeker--range' />
      <span className='fdiFrame__controller__seeker--slider' style={{ width: `${dragPos}px` }} />
    </button>
  );
};

export default IFrameControllerSeeker;
