import type { YouTubePlayer } from 'react-youtube';
import IFrameControllerPlayPause from './IFrameControllerPlayPause';
import IFrameControllerVolumeIndicator from './IFrameControllerVolumeIndicator';
import IFrameControllerVolumeSlider from './IFrameControllerVolumeSlider';
import IFrameControllerTimeStamp from './IFrameControllerTimeStamp';
import IFrameControllerSeeker from './IFrameControllerSeeker';
import { memo } from 'react';
import type { PlayerPlayState } from 'app/film-database/components/iframe/FDiFrame';
import { PlayerVolumeProvider } from 'app/film-database/components/iframe/iframe-controller/context/PlayerVolumeContext';

const IFrameController = memo(({ player, playState }: { player: YouTubePlayer; playState: PlayerPlayState }) => {
  if (!player) return null;
  return (
    <div className='fdiFrame__controller'>
      <IFrameControllerSeeker player={player} />
      <div className='fdiFrame__controller__controls'>
        <IFrameControllerPlayPause
          player={player}
          playState={playState}
        />
        <PlayerVolumeProvider>
          <IFrameControllerVolumeIndicator player={player} />
          <IFrameControllerVolumeSlider />
        </PlayerVolumeProvider>
        <IFrameControllerTimeStamp player={player} />
      </div>
    </div>
  );
});

export default IFrameController;
