import { usePlayerVolumeContext } from 'app/film-database/components/iframe/iframe-controller/context/PlayerVolumeContext';
import { useEffect, useState, type SVGProps } from 'react';
import type { YouTubePlayer } from 'react-youtube';

function MaterialSymbolsVolumeOffRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      {...props}>
      {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
      <path
        fill='currentColor'
        d='M16.775 19.575q-.275.175-.55.325t-.575.275q-.375.175-.762 0t-.538-.575q-.15-.375.038-.737t.562-.538q.1-.05.188-.1t.187-.1L12 14.8v2.775q0 .675-.612.938T10.3 18.3L7 15H4q-.425 0-.712-.288T3 14v-4q0-.425.288-.712T4 9h2.2L2.1 4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l17 17q.275.275.275.7t-.275.7t-.7.275t-.7-.275zm2.225-7.6q0-2.075-1.1-3.787t-2.95-2.563q-.375-.175-.55-.537t-.05-.738q.15-.4.538-.575t.787 0Q18.1 4.85 19.55 7.05T21 11.975q0 .825-.15 1.638t-.425 1.562q-.2.55-.612.688t-.763.012t-.562-.45t-.013-.75q.275-.65.4-1.312T19 11.975m-4.225-3.55Q15.6 8.95 16.05 10t.45 2v.25q0 .125-.025.25q-.05.325-.35.425t-.55-.15L14.3 11.5q-.15-.15-.225-.337T14 10.775V8.85q0-.3.263-.437t.512.012M9.75 6.95Q9.6 6.8 9.6 6.6t.15-.35l.55-.55q.475-.475 1.087-.213t.613.938V8q0 .35-.3.475t-.55-.125z'
      />
    </svg>
  );
}
function MaterialSymbolsVolumeMuteRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      {...props}>
      {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
      <path
        fill='currentColor'
        d='M11 15H8q-.425 0-.712-.288T7 14v-4q0-.425.288-.712T8 9h3l3.3-3.3q.475-.475 1.088-.213t.612.938v11.15q0 .675-.612.938T14.3 18.3z'
      />
    </svg>
  );
}
function MaterialSymbolsVolumeDownRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      {...props}>
      {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
      <path
        fill='currentColor'
        d='M9 15H6q-.425 0-.712-.288T5 14v-4q0-.425.288-.712T6 9h3l3.3-3.3q.475-.475 1.088-.213t.612.938v11.15q0 .675-.612.938T12.3 18.3zm9.5-3q0 1.05-.475 1.988t-1.25 1.537q-.25.15-.512.013T16 15.1V8.85q0-.3.263-.437t.512.012q.775.625 1.25 1.575t.475 2'
      />
    </svg>
  );
}
function MaterialSymbolsVolumeUpRounded(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      {...props}>
      {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
      <path
        fill='currentColor'
        d='M19 11.975q0-2.075-1.1-3.787t-2.95-2.563q-.375-.175-.55-.537t-.05-.738q.15-.4.538-.575t.787 0Q18.1 4.85 19.55 7.063T21 11.974t-1.45 4.913t-3.875 3.287q-.4.175-.788 0t-.537-.575q-.125-.375.05-.737t.55-.538q1.85-.85 2.95-2.562t1.1-3.788M7 15H4q-.425 0-.712-.288T3 14v-4q0-.425.288-.712T4 9h3l3.3-3.3q.475-.475 1.088-.213t.612.938v11.15q0 .675-.612.938T10.3 18.3zm9.5-3q0 1.05-.475 1.988t-1.25 1.537q-.25.15-.513.013T14 15.1V8.85q0-.3.263-.437t.512.012q.775.625 1.25 1.575t.475 2'
      />
    </svg>
  );
}

const IFrameControllerVolumeIndicator = ({ player }: { player: YouTubePlayer }) => {
  const { playerVolume } = usePlayerVolumeContext();
  const [svg, setSvg] = useState(<MaterialSymbolsVolumeOffRounded />);

  const updateSvg = async (isMuted: boolean) => {
    if (isMuted) {
      setSvg(<MaterialSymbolsVolumeOffRounded />);
    } else if (playerVolume === 0) {
      setSvg(<MaterialSymbolsVolumeMuteRounded />);
    } else if (playerVolume <= 50) {
      setSvg(<MaterialSymbolsVolumeDownRounded />);
    } else {
      setSvg(<MaterialSymbolsVolumeUpRounded />);
    }
  };

  const changeMuteState = async () => {
    const isPlayerMuted = await player.isMuted();
    if (isPlayerMuted) await player.unMute();
    else await player.mute();
    await updateSvg(!isPlayerMuted);
  };

  useEffect(() => {
    const syncVolume = async () => {
      await player.setVolume(playerVolume);
      const isMuted = await player.isMuted();
      if (isMuted && playerVolume > 0) await player.unMute();
      await updateSvg(isMuted);
    };

    syncVolume();
  }, [playerVolume]);

  return (
    <button
      className='fdiFrame__controller__controls__button'
      aria-label={playerVolume === 0 ? 'Unmute video' : 'Mute video'}
      onClick={changeMuteState}>
      {svg}
    </button>
  );
};

export default IFrameControllerVolumeIndicator;
