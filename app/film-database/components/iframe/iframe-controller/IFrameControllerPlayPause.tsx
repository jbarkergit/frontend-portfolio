import type { PlayerPlayState } from 'app/film-database/components/iframe/FDiFrame';
import { useModalContext } from 'app/film-database/context/ModalContext';
import { type JSX, type SVGProps, useEffect, useState } from 'react';
import type { YouTubePlayer } from 'react-youtube';
import { SvgSpinnersRingResize } from '../../../assets/svg/icons';

function MaterialSymbolsPauseRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
      <path
        fill='currentColor'
        d='M16 19q-.825 0-1.412-.587T14 17V7q0-.825.588-1.412T16 5t1.413.588T18 7v10q0 .825-.587 1.413T16 19m-8 0q-.825 0-1.412-.587T6 17V7q0-.825.588-1.412T8 5t1.413.588T10 7v10q0 .825-.587 1.413T8 19'
      />
    </svg>
  );
}
function MaterialSymbolsPlayArrowRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
      <path
        fill='currentColor'
        d='M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712'
      />
    </svg>
  );
}

const IFrameControllerPlayPause = ({ player, playState }: { player: YouTubePlayer; playState: PlayerPlayState }) => {
  const { modal } = useModalContext();
  const [playStateSymbolComponent, setPlayStateSymbolComponent] = useState<JSX.Element>(<SvgSpinnersRingResize />);

  useEffect(() => {
    // Provide visual status of play state to the user
    const reflectPlayerState = async () => {
      switch (playState) {
        case 'unstarted':
        case 'paused':
          setPlayStateSymbolComponent(<MaterialSymbolsPauseRounded />);
          break;

        case 'playing':
        case 'ended':
          setPlayStateSymbolComponent(<MaterialSymbolsPlayArrowRounded />);
          break;

        case 'buffering':
        case 'cued':
        default:
          setPlayStateSymbolComponent(<SvgSpinnersRingResize />);
          break;
      }
    };

    reflectPlayerState();
  }, [playState]);

  // Pause playback when modal is opened, play when closed
  useEffect(() => {
    const onModalOpen = async () => await player.pauseVideo();
    if (modal) onModalOpen();
  }, [modal]);

  const changePlaystate = async () => {
    playState === 'playing' ? await player.pauseVideo() : await player.playVideo();
  };

  return (
    <button
      className='fdiFrame__controller__controls__button'
      aria-label={playState === 'playing' ? 'Pause video' : 'Play video'}
      onClick={changePlaystate}
    >
      {playStateSymbolComponent}
    </button>
  );
};

export default IFrameControllerPlayPause;
