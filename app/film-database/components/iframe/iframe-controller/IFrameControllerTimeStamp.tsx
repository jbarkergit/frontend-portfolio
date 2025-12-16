import { useEffect, useState } from 'react';
import type { YouTubePlayer } from 'react-youtube';

const formatTime = (time: number): string => {
  const minutes: number = Math.floor(time / 60);
  const seconds: number = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const IFrameControllerTimeStamp = ({ player }: { player: YouTubePlayer }) => {
  const [timeStamp, setTimeStamp] = useState<{ current: string; duration: string }>({
    current: '00:00',
    duration: '00:00',
  });

  const updatePlayerTimeStamp = async () => {
    const currentTime: number = await player.getCurrentTime();
    const videoDuration: number = await player.getDuration();

    if (isNaN(currentTime) || isNaN(videoDuration)) return;

    setTimeStamp({ current: formatTime(currentTime), duration: formatTime(videoDuration) });
  };

  useEffect(() => {
    updatePlayerTimeStamp();
    const interval = setInterval(updatePlayerTimeStamp, 1000);
    return () => clearInterval(interval);
  }, [player]);

  return (
    <div className='fdiFrame__controller__controls__timestamp' aria-label='Video timestamp information'>
      <div
        className='fdiFrame__controller__controls__timestamp--current'
        aria-label={`Current playback time ${timeStamp.current}`}
      >
        {timeStamp.current}
      </div>
      <div className='fdiFrame__controller__controls__timestamp--separator'> / </div>
      <div
        className='fdiFrame__controller__controls__timestamp--duration'
        aria-label={`Video duration ${timeStamp.duration}`}
      >
        {timeStamp.duration}
      </div>
    </div>
  );
};

export default IFrameControllerTimeStamp;
