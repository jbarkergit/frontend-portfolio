// import { type SVGProps, useEffect, useState } from 'react';
// import type { YouTubePlayer } from 'react-youtube';

// /* Fullscreen requires a reload of the embed, which breaks the embed. */

// function IcTwotoneFullscreen(props: SVGProps<SVGSVGElement>) {
//   return (
//     <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24' {...props}>
//       {/* Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE */}
//       <path fill='currentColor' d='M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z' />
//     </svg>
//   );
// }

// const IFrameControllerFullscreen = ({ player }: { player: YouTubePlayer }) => {
//   const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
//   const { heroData } = useHeroDataContext();

//   useEffect(() => {
//     const changePlayerOpts = async () => {
//       try {
//         await player.setOption('playerVars', 'controls', isFullscreen ? 1 : 0);
//         await player.setOption('playerVars', 'disablekb', isFullscreen ? 0 : 1);

//         const iframe = await player.getIframe();

//         if (iframe.requestFullscreen) {
//           iframe.requestFullscreen();
//         } else if ((iframe as any).mozRequestFullScreen) {
//           (iframe as any).mozRequestFullScreen();
//         } else if ((iframe as any).webkitRequestFullscreen) {
//           (iframe as any).webkitRequestFullscreen();
//         } else if ((iframe as any).msRequestFullscreen) {
//           (iframe as any).msRequestFullscreen();
//         }
//       } catch (error) {
//         console.error('Error updating player options:', error);
//       }
//     };

//     changePlayerOpts();
//   }, [isFullscreen]);

//   return (
//     <button
//       className='fdiFrame__controller__controls__button'
//       aria-label='Open trailer in fullscreen mode'
//       onClick={() => setIsFullscreen((prev) => !prev)}
//     >
//       <IcTwotoneFullscreen />
//     </button>
//   );
// };

// export default IFrameControllerFullscreen;
