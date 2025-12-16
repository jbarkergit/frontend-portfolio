import { firebaseAuth } from 'app/base/firebase/config/firebaseConfig';
import { useHeroDataContext } from 'app/film-database/context/HeroDataContext';
import { useModalContext } from 'app/film-database/context/ModalContext';
import { useModalTrailerContext } from 'app/film-database/context/ModalTrailerContext';
import { signOut } from 'firebase/auth';
import { type SVGProps, useCallback, useEffect, useRef, useState } from 'react';

function StreamlinePlumpUserStickerSquareSolid(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' {...props}>
      {/* Icon from Plump free icons by Streamline - https://creativecommons.org/licenses/by/4.0/ */}
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M7.939 2.06c3.258-.27 8.51-.56 16.061-.56s12.803.29 16.061.56c3.17.263 5.616 2.71 5.879 5.879c.27 3.258.56 8.51.56 16.061c0 2.026-.02 3.833-.057 5.5q-.01.503-.077 1.004c-3.662.05-6.661.527-8.836 1.029a7.94 7.94 0 0 0-5.996 5.996c-.502 2.175-.98 5.175-1.03 8.837q-.5.067-1.004.077c-1.667.036-3.474.057-5.5.057c-7.552 0-12.802-.29-16.061-.56c-3.17-.263-5.616-2.71-5.879-5.879c-.27-3.258-.56-8.51-.56-16.061s.29-12.802.56-16.061c.263-3.17 2.71-5.616 5.879-5.879m6.785 24.4a2 2 0 0 1 2.816.264C19.4 28.968 21.746 30 24 30s4.6-1.032 6.46-3.276a2 2 0 0 1 3.08 2.552C30.981 32.365 27.537 34 24 34s-6.981-1.635-9.54-4.724a2 2 0 0 1 .264-2.816M18 17a2 2 0 1 0-4 0v2a2 2 0 1 0 4 0zm14-2a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0v-2a2 2 0 0 0-2-2m1.532 30.333q.404-.237.781-.53c1.306-1.014 3.225-2.628 5.543-4.947s3.933-4.237 4.947-5.543q.293-.377.53-.78c-2.935.113-5.349.513-7.13.923a4.93 4.93 0 0 0-3.746 3.747c-.411 1.78-.81 4.195-.925 7.13'
        clipRule='evenodd'
      />
    </svg>
  );
}

function SolarVideoLibraryBoldDuotone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      {/* Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ */}
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M15.328 7.542H8.672c-3.374 0-5.062 0-6.01.987s-.725 2.511-.278 5.56l.422 2.892c.35 2.391.525 3.587 1.422 4.303c.898.716 2.22.716 4.867.716h5.81c2.646 0 3.97 0 4.867-.716s1.072-1.912 1.422-4.303l.422-2.892c.447-3.049.67-4.573-.278-5.56s-2.636-.987-6.01-.987m-.747 8.252c.559-.346.559-1.242 0-1.588l-3.371-2.09c-.543-.337-1.21.101-1.21.794v4.18c0 .693.667 1.13 1.21.794z'
        clipRule='evenodd'
      />
      <path
        fill='currentColor'
        d='M8.51 2h6.98c.232 0 .41 0 .566.015c1.108.109 2.015.775 2.4 1.672H5.543c.384-.897 1.291-1.563 2.399-1.672C8.099 2 8.277 2 8.51 2'
        opacity='.4'
      />
      <path
        fill='currentColor'
        d='M6.31 4.723c-1.39 0-2.53.84-2.911 1.953l-.023.07c.398-.12.812-.199 1.232-.253c1.08-.138 2.446-.138 4.032-.138h6.892c1.586 0 2.951 0 4.032.138a8 8 0 0 1 1.232.253l-.023-.07c-.38-1.114-1.521-1.953-2.912-1.953z'
        opacity='.7'
      />
    </svg>
  );
}

const FDHeader = () => {
  const { setModal } = useModalContext();
  const { setModalTrailer } = useModalTrailerContext();
  const { heroData } = useHeroDataContext();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState<boolean>(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  const handleExteriorClick = useCallback((event: MouseEvent): void => {
    if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
      accountDropdownRef.current.setAttribute('data-open', 'false');
      setIsAccountDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    const openAccountDropdown = (): void => {
      accountDropdownRef.current?.setAttribute('data-open', isAccountDropdownOpen ? 'true' : 'false');
    };
    openAccountDropdown();

    if (isAccountDropdownOpen) document.addEventListener('pointerup', handleExteriorClick);
    else document.removeEventListener('pointerup', handleExteriorClick);

    return () => document.removeEventListener('pointerup', handleExteriorClick);
  }, [isAccountDropdownOpen, handleExteriorClick]);

  return (
    <div className='fdHeader'>
      <div className='fdHeader__app'>FILM DATABASE</div>
      <ul className='fdHeader__ul'>
        <li className='fdHeader__ul__li'>
          <button
            className='fdHeader__ul__li__button'
            aria-label='Open Collections'
            onClick={() => {
              setModal('collections');
              setModalTrailer(heroData);
            }}
          >
            <SolarVideoLibraryBoldDuotone />
            Open Collections
          </button>
        </li>
      </ul>
      <div className='fdHeader__account'>
        <div aria-label='My Account' onClick={() => setIsAccountDropdownOpen((prev) => !prev)}>
          <StreamlinePlumpUserStickerSquareSolid />
          <div ref={accountDropdownRef} data-open='false'>
            <button aria-label='Sign out' onClick={async () => await signOut(firebaseAuth)}>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FDHeader;
