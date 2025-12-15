import { useEffect, useReducer, useRef } from 'react';
import { Link } from 'react-router';

import carousel1 from '/app/ecommerce/assets/production-images/compressed-home-page/carousel/brian-tromp-rWMAni9akN8-unsplash.jpg?url';
import carousel2 from '/app/ecommerce/assets/production-images/compressed-home-page/carousel/katrina-beachy-c_egiHy2x4Y-unsplash.jpg?url';
import carousel3 from '/app/ecommerce/assets/production-images/compressed-home-page/carousel/lena-kudryavtseva-hdODD2TVIlM-unsplash.jpg?url';
import carousel4 from '/app/ecommerce/assets/production-images/compressed-home-page/carousel/rekkr-insitu-black.jpg?url';
import carousel5 from '/app/ecommerce/assets/production-images/compressed-home-page/carousel/soundtrap-uCNrr-3i2oI-unsplash.jpg?url';

type initSliderStateType = {
  pointerDown: boolean;
  initPageX: number;
  pageX: number;
  trackPos: number;
  previousTrackPos: number;
  style: React.CSSProperties;
};

export const initState: initSliderStateType = {
  pointerDown: false,
  initPageX: 0,
  pageX: 0,
  trackPos: 0,
  previousTrackPos: 0,
  style: { transform: `translateX(0px)` },
};

type actionType =
  | { type: 'POINTER_DOWN'; pointerDown: boolean; initPageX: number; pageX: number }
  | { type: 'POINTER_MOVE'; pointerDown: boolean; pageX: number }
  | { type: 'POINTER_LEAVE'; pointerDown: boolean; previousTrackPos: number }
  | { type: 'POINTER_UP'; pointerDown: boolean; previousTrackPos: number };

const Carousel = () => {
  const targetElementRef = useRef<HTMLUListElement>(null),
    targetElement: HTMLElement | null = targetElementRef.current as HTMLElement,
    targetElementWidth: number = targetElement?.scrollWidth as number;

  const reducer = (state: initSliderStateType, action: actionType): initSliderStateType => {
    switch (action.type) {
      case 'POINTER_DOWN':
        return { ...state, pointerDown: true, initPageX: action.initPageX, pageX: action.pageX };

      case 'POINTER_MOVE':
        if (!state.pointerDown) {
          return state;
        } else {
          const pointerTravelDistance: number = action.pageX - state.initPageX;
          const latestTrackPosition = state.previousTrackPos + pointerTravelDistance;
          const targetElementLeftPadding: number = parseInt(window.getComputedStyle(targetElement).paddingLeft);

          const targetElementChildren = targetElement.children[0];
          if (!targetElementChildren) return state;

          const childrenOfChildren = targetElementChildren.children[0];
          if (!childrenOfChildren) return state;

          const maximumDelta = targetElementWidth * -1 + childrenOfChildren.clientWidth + targetElementLeftPadding;
          const clampedTrackPosition: number = Math.max(Math.min(latestTrackPosition, 0), maximumDelta);

          return {
            ...state,
            trackPos: clampedTrackPosition,
            style: { transform: `translateX(${clampedTrackPosition}px)` },
          };
        }

      case 'POINTER_LEAVE':
      case 'POINTER_UP':
        if (!state.pointerDown) {
          return state;
        } else {
          return {
            ...state,
            pointerDown: false,
            trackPos: state.trackPos,
            previousTrackPos: state.trackPos,
          };
        }
      default:
        throw new Error('FAILURE: Action Type may be missing or returning null');
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    const targetElement = targetElementRef?.current!;

    const userPointerDown = (e: PointerEvent) => {
      if (!state.pointerDown && e.target instanceof HTMLAnchorElement) return state;
      const pageX = e.pageX as number;
      dispatch({ type: 'POINTER_DOWN', pointerDown: true, initPageX: pageX, pageX: pageX });
    };

    const userPointerMove = (e: PointerEvent) => {
      const pageX = e.pageX as number;
      dispatch({
        type: 'POINTER_MOVE',
        pageX: pageX,
        pointerDown: state.pointerDown,
      });
    };

    const userPointerLeave = () =>
      dispatch({ type: 'POINTER_LEAVE', pointerDown: false, previousTrackPos: state.trackPos });

    const userPointerUp = () => dispatch({ type: 'POINTER_UP', pointerDown: false, previousTrackPos: state.trackPos });

    targetElement?.addEventListener('pointerdown', userPointerDown);
    targetElement?.addEventListener('pointermove', userPointerMove);
    targetElement?.addEventListener('pointerleave', userPointerLeave);
    targetElement?.addEventListener('pointerup', userPointerUp);

    return () => {
      targetElement?.removeEventListener('pointerdown', userPointerDown);
      targetElement?.removeEventListener('pointermove', userPointerMove);
      targetElement?.removeEventListener('pointerleave', userPointerLeave);
      targetElement?.removeEventListener('pointerup', userPointerUp);
    };
  }, []);

  // Carousel items
  const carouselUlArr = [
    {
      carouselImg: carousel1,
      carouselAlt: 'Slide A',
      navCat: 'All Products',
      linkTo: 'products',
    },
    {
      carouselImg: carousel2,
      carouselAlt: 'Slide B',
      navCat: 'Headphones',
      linkTo: 'products/headphones',
    },
    {
      carouselImg: carousel3,
      carouselAlt: 'Slide C',
      navCat: 'Amps & Dacs',
      linkTo: 'amps-dacs',
      tabIndex: -1,
    },
    {
      carouselImg: carousel4,
      carouselAlt: 'Slide D',
      navCat: 'Microphones',
      linkTo: 'products/microphones',
      tabIndex: -1,
    },
    {
      carouselImg: carousel5,
      carouselAlt: 'Slide E',
      navCat: 'Interfaces',
      linkTo: 'products/interfaces',
      tabIndex: -1,
    },
  ];

  return (
    <section className='carousel'>
      <div className='carousel__heading'>
        <p>Looking for something specific? We've got you covered.</p>
        <h2>
          Audio solutions for <span className='highlight'>dynamic</span> environments
        </h2>
      </div>
      <ul
        className='carousel__track'
        ref={targetElementRef}
        style={state.style}>
        {carouselUlArr.map((li) => (
          <li key={`carousel-category-${li.navCat}`}>
            <picture>
              <img
                src={li.carouselImg}
                alt={li.carouselAlt}
                draggable='false'
                loading='lazy'
                decoding='async'
                fetchPriority='low'
              />
              <Link
                to={li.linkTo}
                tabIndex={li.tabIndex}>
                {li.navCat}
              </Link>
            </picture>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Carousel;
