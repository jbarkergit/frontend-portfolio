import { useFeatureState } from 'app/portfolio/context/FeatureStateContext';
import { useProjectSlideIndex } from 'app/portfolio/context/ProjectSlideContext';
import { projectData } from 'app/portfolio/data/projectData';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';

const PortFooter = () => {
  const { featureState, setFeatureState } = useFeatureState();
  const { projectSlideIndex } = useProjectSlideIndex();

  const footerNavigationLeft = useRef<HTMLElement>(null);
  const footerNavigationRight = useRef<HTMLDivElement>(null);

  const [navigationIndicator, setNavigationIndicator] = useState({
    key: projectData[projectSlideIndex]?.key,
    insights: 'Project Insights',
    demoLink: 'Live Demo',
  });

  useEffect(() => {
    const setFooterDataAttr = (transitionStatus: string) => {
      footerNavigationLeft.current?.setAttribute('data-transition', transitionStatus);
    };

    footerNavigationLeft.current?.getAttribute('data-transition') === 'false'
      ? setFooterDataAttr('true')
      : setFooterDataAttr('false');

    setTimeout(() => {
      if (projectData[projectSlideIndex]?.key !== '' && projectData[projectSlideIndex]?.url !== '') {
        setNavigationIndicator({
          key: projectData[projectSlideIndex]?.key,
          insights: 'Project Insights',
          demoLink: 'Live Demo',
        });
      } else if (projectData[projectSlideIndex]?.key !== '' && projectData[projectSlideIndex]?.url === '') {
        setNavigationIndicator({ key: projectData[projectSlideIndex].key, insights: 'Project Insights', demoLink: '' });
      } else {
        setNavigationIndicator({ key: 'This project is unavailable', insights: '', demoLink: '' });
      }
    }, 360);
  }, [projectSlideIndex]);

  /** Component Transition Out */
  const initialRender = useRef<boolean>(true);

  const getCarouselNavFooterChildrenArray = (): HTMLElement[] => {
    if ((footerNavigationLeft.current, footerNavigationRight.current)) {
      return [...footerNavigationLeft.current!.children, ...footerNavigationRight.current!.children] as HTMLElement[];
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (initialRender.current) initialRender.current = false;

    if (Object.values(featureState).some((value) => value === true)) {
      // Grid transition out animator
      getCarouselNavFooterChildrenArray().forEach((element: HTMLElement) =>
        element.setAttribute('data-status', 'carouselNavFooterOut')
      );
    } else if (!initialRender) {
      // Grid transition in animator
      setTimeout(
        () =>
          getCarouselNavFooterChildrenArray().forEach((element: HTMLElement) =>
            element.setAttribute('data-status', 'carouselNavFooterIn')
          ),
        1000
      );
    } else {
      // Mount animator
      getCarouselNavFooterChildrenArray().forEach((element: HTMLElement) =>
        element.setAttribute('data-status', 'carouselNavFooterIn')
      );
    }
  }, [featureState]);

  /** Timezone CDT */
  const [currentTime, setCurrentTime] = useState('');

  const getTime = () => {
    setCurrentTime(
      new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/Chicago',
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      })
    );
  };

  useEffect(() => {
    getTime();
    const interval = setInterval(getTime, 60000);
    return () => clearInterval(interval);
  }, []);

  /** TSX */
  return (
    <footer className='carouselNav carouselNav--footer'>
      <section className='carouselNav__section'>
        <nav className='carouselNav__section__left' aria-labelledby='project-links' ref={footerNavigationLeft}>
          <Link to={projectData[projectSlideIndex]?.url}>
            <h2 data-activity='visible'>{navigationIndicator.key}</h2>
          </Link>
          <button
            id='project-links'
            aria-label='Open Project Insights'
            onPointerUp={() =>
              featureState.projectDetailsActive
                ? setFeatureState({ ...featureState, projectDetailsActive: false })
                : setFeatureState({ ...featureState, projectDetailsActive: true })
            }
          >
            {navigationIndicator.insights}
          </button>
          <Link to={projectData[projectSlideIndex]?.url} id='project-links' aria-label='Project Live Demo'>
            {navigationIndicator.demoLink}
          </Link>
        </nav>
      </section>

      <section className='carouselNav__section'>
        <div className='carouselNav__section__right' ref={footerNavigationRight}>
          <span className='carouselNav__section__right--timezone'>
            {currentTime} • CDT (GMT-5){' '}
            <h2 style={{ display: 'none' }}>Current time in Central Daylight Time, GMT-5</h2>
          </span>
        </div>
      </section>
    </footer>
  );
};

export default PortFooter;
