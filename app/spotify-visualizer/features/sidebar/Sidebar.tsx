import type { SVGProps } from 'react';

function doSomething() {}

const buttons = {
  myLibrary: { icon: <BiCollection />, func: doSomething },
  pins: { icon: <BiPinAngle />, func: doSomething },
  playlists: { icon: <BiMusicNoteList />, func: doSomething },
  likedSongs: { icon: <BiBookmark />, func: doSomething },
  saves: { icon: <BiBookmark />, func: doSomething },
  albums: { icon: <BiDisc />, func: doSomething },
  folders: { icon: <BiFolder2 />, func: doSomething },
  podcasts: { icon: <SolarPodcastBoldDuotone />, func: doSomething },
  audiobooks: { icon: <SimpleIconsAudiobookshelf />, func: doSomething },
  artists: { icon: <IconamoonMusicArtistLight />, func: doSomething },
} as const;

export type LibraryKeys = keyof typeof buttons;

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <ul className='sidebar__wrapper'>
        {Object.entries(buttons).map(([key, { icon, func }]) => {
          const formattedKey = key.replace(/([A-Z])/g, ' $1');

          return (
            <li key={key}>
              <button className='library__wrapper__btn' aria-label={formattedKey} onClick={func}>
                <span>{icon}</span>
                <span>{formattedKey}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;

export function BiCollection(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        d='M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5z'
      />
    </svg>
  );
}

export function BiPinAngle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        d='M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588c-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828l-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182l-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146m.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a5 5 0 0 0-.288-.076a5 5 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a5 5 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034q.172.002.343-.04L9.927 2.028q-.042.172-.04.343a1.8 1.8 0 0 0 .062.46z'
      />
    </svg>
  );
}

export function BiMusicNoteList(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <g fill='currentColor'>
        <path d='M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2s2.5.895 2.5 2' />
        <path fillRule='evenodd' d='M12 3v10h-1V3z' />
        <path d='M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z' />
        <path
          fillRule='evenodd'
          d='M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5'
        />
      </g>
    </svg>
  );
}

export function BiHeart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        d='m8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385c.92 1.815 2.834 3.989 6.286 6.357c3.452-2.368 5.365-4.542 6.286-6.357c.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15'
      />
    </svg>
  );
}

export function BiBookmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        d='M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z'
      />
    </svg>
  );
}

export function BiDisc(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <g fill='currentColor'>
        <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
        <path d='M10 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0M8 4a4 4 0 0 0-4 4a.5.5 0 0 1-1 0a5 5 0 0 1 5-5a.5.5 0 0 1 0 1m4.5 3.5a.5.5 0 0 1 .5.5a5 5 0 0 1-5 5a.5.5 0 0 1 0-1a4 4 0 0 0 4-4a.5.5 0 0 1 .5-.5' />
      </g>
    </svg>
  );
}

export function BiFolder2(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
      {/* Icon from Bootstrap Icons by The Bootstrap Authors - https://github.com/twbs/icons/blob/main/LICENSE.md */}
      <path
        fill='currentColor'
        d='M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5z'
      />
    </svg>
  );
}

export function SolarPodcastBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      {/* Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ */}
      <path
        fill='currentColor'
        d='M10.837 10.546c0-.402-.312-.728-.697-.728H8.58c.324-1.66 1.731-2.909 3.42-2.909c1.687 0 3.095 1.25 3.418 2.91H12.93c-.385 0-.697.325-.697.726c0 .402.312.728.697.728h2.559v1.454H12.93c-.385 0-.697.326-.697.728s.312.727.697.727h2.489c-.278 1.425-1.354 2.547-2.721 2.836v2.255c0 .401-.313.727-.698.727s-.698-.326-.698-.727v-2.255c-1.366-.289-2.443-1.411-2.72-2.836h1.558c.385 0 .697-.326.697-.727c0-.402-.312-.728-.697-.728H8.512v-1.454h1.628c.385 0 .697-.326.697-.727'
      />
      <path
        fill='currentColor'
        d='M12 4c-3.33 0-6.054 2.701-6.266 6.116a2.46 2.46 0 0 0-1.176-.298C3.145 9.818 2 11.012 2 12.485v1.94c0 1.472 1.145 2.666 2.558 2.666q.072 0 .143-.004v.004c1.334 0 2.415-1.127 2.415-2.518v-4.028c0-2.811 2.187-5.09 4.884-5.09s4.884 2.279 4.884 5.09v4.028c0 1.39 1.08 2.518 2.415 2.518v-.004q.07.004.143.004c1.413 0 2.558-1.194 2.558-2.667v-1.94c0-1.472-1.145-2.666-2.558-2.666c-.424 0-.824.108-1.176.298C18.054 6.701 15.329 4 12 4'
        opacity='.5'
      />
    </svg>
  );
}

export function SimpleIconsAudiobookshelf(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      {/* Icon from Simple Icons by Simple Icons Collaborators - https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md */}
      <path
        fill='currentColor'
        d='M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0m-.023.402A11.6 11.6 0 0 1 23.575 12a11.6 11.6 0 0 1-11.598 11.598A11.6 11.6 0 0 1 .378 12A11.6 11.6 0 0 1 11.977.402m0 1.776a7.093 7.093 0 0 0-7.092 7.093v1.536a6 6 0 0 0-.439.33a.35.35 0 0 0-.126.27v1.84a.36.36 0 0 0 .126.272c.22.182.722.564 1.504.956v.179c0 .483.31.873.694.873s.694-.392.694-.873v-4.415c0-.483-.31-.873-.694-.873c-.369 0-.67.359-.694.812h-.002v-.91a6.027 6.027 0 1 1 12.054.003v.91c-.025-.454-.326-.813-.695-.813c-.384 0-.694.391-.694.873v4.415c0 .483.31.873.694.873s.695-.392.695-.873v-.179a8 8 0 0 0 1.503-.956a.35.35 0 0 0 .126-.272v-1.843a.34.34 0 0 0-.124-.27a6 6 0 0 0-.438-.329V9.271a7.093 7.093 0 0 0-7.092-7.093m-3.34 5.548a.84.84 0 0 0-.84.84v9.405c0 .464.376.84.84.84h.866a.84.84 0 0 0 .84-.84V8.566a.84.84 0 0 0-.84-.84Zm2.905 0a.84.84 0 0 0-.84.84v9.405c0 .464.377.84.84.84h.867a.84.84 0 0 0 .84-.84V8.566a.84.84 0 0 0-.84-.84zm2.908 0a.84.84 0 0 0-.84.84v9.405c0 .464.376.84.84.84h.867a.84.84 0 0 0 .84-.84V8.566a.84.84 0 0 0-.84-.84zM8.112 9.983h1.915v.2H8.112Zm2.906 0h1.915v.2h-1.915Zm2.908 0h1.915v.2h-1.915zm-7.58 9.119a.633.633 0 0 0 0 1.265h11.26a.632.632 0 0 0 0-1.265z'
      />
    </svg>
  );
}

export function IconamoonMusicArtistLight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      {/* Icon from IconaMoon by Dariush Habibpour - https://creativecommons.org/licenses/by/4.0/ */}
      <g fill='none' stroke='currentColor' strokeWidth='1.5'>
        <circle cx='12' cy='7' r='3' />
        <circle cx='18' cy='18' r='2' strokeLinecap='round' strokeLinejoin='round' />
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M12.341 20H6a2 2 0 0 1-2-2a4 4 0 0 1 4-4h5.528M20 18v-7l2 2'
        />
      </g>
    </svg>
  );
}
