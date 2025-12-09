import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState, type RefObject } from 'react';
import { Link } from 'react-router';
import { useFeatureState } from '~/portfolio/context/FeatureStateContext';
import { useProjectSlideIndex } from '~/portfolio/context/ProjectSlideContext';
import { projectData } from '~/portfolio/data/projectData';

type ActionType =
  | {
      type: 'POINTER_DOWN';
      payload: { anchorEnabled: boolean; initPageX: number; pageX: number; initPageY: number; pageY: number };
    }
  | {
      type: 'POINTER_MOVE';
      payload: { anchorEnabled: boolean; pageX: number; pageY: number };
    }
  | {
      type: 'POINTER_LEAVE';
      payload: {
        anchorEnabled: boolean;
        previousTrackPos: number;
      };
    }
  | {
      type: 'POINTER_UP';
      payload: {
        previousTrackPos: number;
      };
    }
  | { type: 'WHEEL_SCROLL'; payload: { deltaY: number } }
  | {
      type: 'EXTERNAL_NAVIGATION';
      payload: {};
    }
  | { type: 'RESET_WHEEL_ACTIVE'; payload: { wheelEventActive: boolean } };

type StyleDistances = {
  scale: number;
  grayscale: number;
  sepia: number;
  brightness: number;
};

const initState = {
  activeArticleIndex: 0,
  pointerDown: false,
  wheelEventActive: false,
  anchorEnabled: true,
  initPageX: 0,
  pageX: 0,
  initPageY: 0,
  pageY: 0,
  previousTrackPos: 0,
  trackPos: 0,
};

const ProjectCarousel = () => {
  const { featureState } = useFeatureState();
  const { projectSlideIndex, setProjectSlideIndex } = useProjectSlideIndex();

  /** References */
  const mainRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const articleArray = useRef<HTMLAnchorElement[]>([]);

  const articleRef = (reference: HTMLAnchorElement) => {
    if (reference && !articleArray.current.includes(reference)) {
      articleArray.current.push(reference);
    }
  };

  /** Helpers */
  const [carouselPaddingLeft, setCarouselPaddingLeft] = useState(0);
  const [articlePositions, setArticlePositions] = useState<number[]>([]);

  useLayoutEffect(() => {
    if (!carouselRef.current) return;
    setCarouselPaddingLeft(parseInt(getComputedStyle(carouselRef.current).paddingLeft));
  }, []);

  useLayoutEffect(() => {
    if (!articleArray.current.length) return;

    const updatePositions = () => {
      setArticlePositions(articleArray.current.map((child) => child.offsetLeft * -1));
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  /** Active article position */
  const activeArticlePosition = useMemo(
    () => articlePositions[projectSlideIndex],
    [articlePositions, projectSlideIndex]
  );

  /** Dynamic Mapping */
  const [size, setSize] = useState<Record<'width' | 'height', number>>({ width: 0, height: 0 });

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    if (mainRef.current) observer.observe(mainRef.current);
    return () => observer.disconnect();
  }, []);

  /** Reducer */
  const reducer = (state: typeof initState, action: ActionType): typeof initState => {
    switch (action.type) {
      case 'POINTER_DOWN':
        return {
          ...state,
          pointerDown: true,
          anchorEnabled: action.payload.anchorEnabled,
          initPageX: action.payload.initPageX,
          pageX: action.payload.pageX,
          initPageY: action.payload.initPageY,
          pageY: action.payload.pageY,
        };

      case 'POINTER_MOVE':
        if (!state.pointerDown) return state;

        const pointerTravelDistance: number = action.payload.pageX - state.initPageX; // horizontal delta
        const newTrackPosition: number = state.previousTrackPos + pointerTravelDistance; // proposed translateX position

        const carouselScrollWidth: number = (carouselRef.current?.scrollWidth as number) * -1; // full scroll width inverted
        const articleSample = articleArray.current[0];
        if (!articleSample) return state;
        const articleOffsetWidth: number = articleSample.offsetWidth + carouselPaddingLeft * 2; // article width + padding

        const maxTravelDelta: number = carouselScrollWidth + articleOffsetWidth; // maximum allowed negative travel
        const clampedTrackPosition: number = Math.max(Math.min(newTrackPosition, 0), maxTravelDelta); // clamp to bounds

        return {
          ...state,
          anchorEnabled: action.payload.anchorEnabled,
          trackPos: Math.round(clampedTrackPosition),
        };

      case 'POINTER_UP':
      case 'POINTER_LEAVE':
        if (!state.pointerDown) return state;

        const distances = articlePositions.map((pos) => Math.abs(pos - state.trackPos)); // distance to each article snap point
        const closestIndex = distances.indexOf(Math.min(...distances)); // nearest article index
        const closestArticle = articlePositions[closestIndex]; // nearest article position
        if (!closestArticle) return state;
        const closestPos = closestArticle + carouselPaddingLeft; // snapped translateX including padding

        return {
          ...state,
          pointerDown: false,
          activeArticleIndex: closestIndex,
          previousTrackPos: closestPos,
          trackPos: Math.round(closestPos),
        };

      case 'WHEEL_SCROLL':
        if (!state.wheelEventActive && window.innerWidth > 1480) {
          const scrollWheelDirection: number = Math.sign(action.payload.deltaY); // -1 up, 1 down
          const scrollYDirection = { verticalUp: -1, veritcalDown: 1 };

          let nextClosestIndex: number = state.activeArticleIndex;

          if (scrollWheelDirection === scrollYDirection.verticalUp) {
            nextClosestIndex = Math.min(state.activeArticleIndex + 1, articlePositions.length - 1); // move right
          }

          if (scrollWheelDirection === scrollYDirection.veritcalDown) {
            nextClosestIndex = Math.max(state.activeArticleIndex - 1, 0); // move left
          }

          const closestChild = articlePositions[nextClosestIndex]; // target snap point
          if (!closestChild) return state;
          const closestChildPos: number = closestChild + carouselPaddingLeft; // snapped translateX including padding

          return {
            ...state,
            activeArticleIndex: nextClosestIndex,
            wheelEventActive: true,
            previousTrackPos: closestChildPos,
            trackPos: Math.round(closestChildPos),
          };
        } else {
          return state;
        }

      case 'EXTERNAL_NAVIGATION':
        if (!activeArticlePosition) return state;
        return {
          ...state,
          activeArticleIndex: projectSlideIndex,
          previousTrackPos: activeArticlePosition + carouselPaddingLeft, // external snap target + padding
          trackPos: Math.round(activeArticlePosition + carouselPaddingLeft), // apply transform
        };

      case 'RESET_WHEEL_ACTIVE':
        return { ...state, wheelEventActive: false };

      default:
        throw new Error('FAILURE: Action Type may be missing or returning null');
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);

  /** Dispatch Actions */
  let pointerDownTimer: NodeJS.Timeout | null = null;

  const userPointerDownHandler = (e: PointerEvent): void => {
    if (pointerDownTimer) clearTimeout(pointerDownTimer);

    pointerDownTimer = setTimeout(() => {
      dispatch({
        type: 'POINTER_DOWN',
        payload: {
          anchorEnabled: true,
          initPageX: e.pageX as number,
          pageX: e.pageX as number,
          initPageY: e.pageY as number,
          pageY: e.pageY as number,
        },
      });
    }, 40);
  };

  const userPointerMoveHandler = (e: PointerEvent): void => {
    dispatch({
      type: 'POINTER_MOVE',
      payload: {
        anchorEnabled: false,
        pageX: e.pageX as number,
        pageY: e.pageY,
      },
    });
  };

  const cancelPointerDown = () => {
    if (pointerDownTimer) {
      clearTimeout(pointerDownTimer);
      pointerDownTimer = null;
    }
  };

  const userPointerLeaveHandler = (): void => {
    cancelPointerDown();
    dispatch({
      type: 'POINTER_LEAVE',
      payload: {
        anchorEnabled: true,
        previousTrackPos: state.trackPos,
      },
    });
  };

  const userPointerUpHandler = (): void => {
    cancelPointerDown();
    dispatch({
      type: 'POINTER_UP',
      payload: {
        previousTrackPos: state.trackPos,
      },
    });
  };

  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  const userWheelEventHandler = (e: WheelEvent) => {
    if (wheelTimeout.current) clearTimeout(wheelTimeout.current);

    dispatch({
      type: 'WHEEL_SCROLL',
      payload: {
        deltaY: e.deltaY,
      },
    });

    wheelTimeout.current = setTimeout(() => {
      dispatch({ type: 'RESET_WHEEL_ACTIVE', payload: { wheelEventActive: false } });
      wheelTimeout.current = null;
    }, 360);
  };

  useEffect(() => {
    const carousel = carouselRef.current;

    if (carousel && !Object.values(featureState).some((value: boolean) => value === true)) {
      carousel.addEventListener('pointerdown', userPointerDownHandler);
      carousel.addEventListener('pointermove', userPointerMoveHandler);
      carousel.addEventListener('pointerleave', userPointerLeaveHandler);
      carousel.addEventListener('pointerup', userPointerUpHandler);
      carousel.addEventListener('wheel', userWheelEventHandler);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('pointerdown', userPointerDownHandler);
        carousel.removeEventListener('pointermove', userPointerMoveHandler);
        carousel.removeEventListener('pointerleave', userPointerLeaveHandler);
        carousel.removeEventListener('pointerup', userPointerUpHandler);
        carousel.removeEventListener('wheel', userWheelEventHandler);
      }
      cancelPointerDown();
    };
  }, [featureState]);

  /** Sync projectSlideIndex from context with useReducer state for header project navigation */
  useEffect(() => {
    if (state.activeArticleIndex !== projectSlideIndex) {
      dispatch({
        type: 'EXTERNAL_NAVIGATION',
        payload: {},
      });
    }
  }, [projectSlideIndex]);

  useEffect(() => {
    if (projectSlideIndex !== state.activeArticleIndex) {
      setProjectSlideIndex(state.activeArticleIndex);
    }
  }, [state.activeArticleIndex]);

  /** Looped carousel article animator */
  const getCarouselSlideFX = (): StyleDistances[] => {
    let styleDists: StyleDistances[] = [];

    if (mainRef.current && articleArray.current) {
      const carouselSliderWidth: number = mainRef.current.clientWidth as number;

      for (const slide of articleArray.current) {
        // Resize Slides
        const slideBound: DOMRect = slide.getBoundingClientRect();
        const slideCenterX: number = slideBound.right - slideBound.width / 2;
        const slideDistanceFromViewport = Math.abs(slideCenterX - carouselSliderWidth / 2);
        const containerDimensions = carouselSliderWidth;

        const scale: Record<'filterMinimum' | 'filterMaximum' | 'maximumDistance' | 'scaleExponent', number> = {
          filterMinimum: 0.8,
          filterMaximum: 1,
          maximumDistance: containerDimensions / 2 + carouselPaddingLeft,
          scaleExponent: 2,
        } as const;

        const scaleDistanceRatio = slideDistanceFromViewport / scale.maximumDistance; // How far the slide is from the maximum distance
        const scaledDistance = Math.pow(scaleDistanceRatio, scale.scaleExponent); // Scale distance value
        const scaleRangeDifference = scale.filterMaximum - scale.filterMinimum; // Scale range difference
        const newScaleValue = scale.filterMinimum + scaleRangeDifference * (1 - scaledDistance); // New scale value
        const scaleFilterClamp = Math.min(scale.filterMaximum, Math.max(scale.filterMinimum, newScaleValue)); // Clamped scale value

        /** Calculate filter intensity: distance between slide and viewport center */
        const filterIntensity: number =
          (scaleFilterClamp - scale.filterMinimum) / (scale.filterMaximum - scale.filterMinimum);

        const saturationFilter: Record<'grayscale' | 'sepia' | 'brightness', number> = {
          grayscale: 85 - filterIntensity * 85,
          sepia: 80 - filterIntensity * 80,
          brightness: 50 - filterIntensity * 50 * -1,
        };

        /** Calculate scale && filter data, store */
        const styleDistances: StyleDistances = {
          scale: scaleFilterClamp,
          grayscale: Math.round(saturationFilter.grayscale),
          sepia: Math.round(saturationFilter.sepia),
          brightness: Math.round(saturationFilter.brightness),
        };

        styleDists.push(styleDistances);
      }
    }

    return styleDists;
  };

  const animationRef = useRef<number | null>(null);

  const animateLoop = (): void => {
    const styleDistancesArray: StyleDistances[] = getCarouselSlideFX();

    for (let i = 0; i < articleArray.current.length; i++) {
      const article = articleArray.current[i];
      const targetStyle = styleDistancesArray[i];

      if (article && targetStyle) {
        // Smooth interpolation, 3 decimals
        const lerpedScale = Math.round(targetStyle.scale * 1000) / 1000;

        // Apply interpolated transform
        article.style.transform = `scale(${lerpedScale})`;

        // Apply filter
        article.style.filter = `grayscale(${targetStyle.grayscale}%) sepia(${targetStyle.sepia}%) brightness(${targetStyle.brightness}%)`;
      }
    }

    animationRef.current = requestAnimationFrame(animateLoop); // Schedule next frame
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateLoop); // Start loop

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  /** Mount animation */
  const initialRender = useRef<boolean>(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      carouselRef.current?.setAttribute('data-visible', 'true');
    }
  }, []);

  useEffect(() => {
    if (Object.values(featureState).some((value) => value === true)) {
      const entryWithTrue = Object.entries(featureState).find(([key, value]) => value === true);
      const trueKey = entryWithTrue ? entryWithTrue[0] : null;
      mainRef.current?.setAttribute('data-status', trueKey === 'projectDetailsActive' ? 'disabled' : 'contact'); // Grid transition out animator
    } else if (!initialRender) {
      setTimeout(() => mainRef.current?.setAttribute('data-status', 'active'), 1000); // Grid transition in animator
    } else {
      mainRef.current?.setAttribute('data-status', 'active'); // Mount animator
    }
  }, [featureState]);

  /** Component */
  return (
    <main
      className='mainContent'
      ref={mainRef}>
      <div
        className='mainContent__track'
        ref={carouselRef}
        style={{ transform: `translate3d(${state.trackPos}px, 0, 0)` }}
        data-visible={'false'}
        data-status={!state.pointerDown ? 'smooth' : ''}>
        {projectData.map((project) => (
          <Link
            className='mainContent__track__project'
            ref={articleRef}
            // To prevent navigation dupes due to use of the map method we have to force the string as an absolute as opposed to relative by utilizing a string method
            to={`/${project.url.toLowerCase()}`}
            aria-label={`${project.key} Live Demo`}
            key={project.key}
            onClick={(e) => {
              if (!state.anchorEnabled) e.preventDefault();
            }}
            onDragStart={(e) => e.preventDefault()}>
            <picture>
              <img
                src={size.width > 950 ? project.imgSrc : project.imgSrcMobile}
                alt={project.imgAlt}
                rel='preload'
                loading='eager'
                draggable='false'
                decoding='async'
                fetchPriority='high'
              />
            </picture>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default ProjectCarousel;
