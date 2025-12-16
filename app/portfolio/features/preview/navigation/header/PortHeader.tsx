import { useFeatureState } from 'app/portfolio/context/FeatureStateContext';
import { useProjectSlideIndex } from 'app/portfolio/context/ProjectSlideContext';
import { projectData } from 'app/portfolio/data/projectData';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router';

/** Component */
const PortHeader = () => {
  const { featureState, setFeatureState } = useFeatureState();
  const { projectSlideIndex, setProjectSlideIndex } = useProjectSlideIndex();

  const initialRender = useRef<boolean>(true),
    carouselNavSectionLeft = useRef<HTMLDivElement>(null),
    carouselNavSectionRight = useRef<HTMLDivElement>(null),
    carouselNavSectionRightNav = useRef<HTMLDivElement>(null),
    carouselNavSectionRightAnimator = useRef<HTMLDivElement>(null),
    unorderedListRef = useRef<HTMLUListElement | null>(null),
    animatorLineArray = useRef<HTMLSpanElement[]>([]);

  //** Arrow position references & logic */
  const unorderedListChildrenArray = Array.from(unorderedListRef.current?.children ?? []) as HTMLLIElement[],
    unorderedListChildrenPositionArray = unorderedListChildrenArray.map((child) => child.offsetLeft);

  // Set arrow position of project navigation by number
  useEffect(() => {
    if (unorderedListRef.current)
      unorderedListRef.current.style.setProperty(
        '--afterPsuedoSelector',
        `${unorderedListChildrenPositionArray[projectSlideIndex]}px`
      );
  }, [projectSlideIndex]);

  /** Component Transition Out */
  const getCarouselNavHeaderChildrenArray = (): HTMLElement[] => {
    if (
      carouselNavSectionLeft.current &&
      carouselNavSectionRight.current &&
      carouselNavSectionRightNav.current &&
      carouselNavSectionRightAnimator.current
    ) {
      return [
        ...carouselNavSectionLeft.current.children,
        ...carouselNavSectionRight.current.children,
        ...carouselNavSectionRightNav.current.children,
        ...carouselNavSectionRightAnimator.current.children,
      ] as HTMLElement[];
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (initialRender.current) initialRender.current = false;

    if (Object.values(featureState).some((value) => value === true)) {
      // Grid transition out animator
      getCarouselNavHeaderChildrenArray().forEach((element: HTMLElement) =>
        element.setAttribute('data-status', 'carouselNavHeaderOut')
      );
    } else if (!initialRender) {
      // Grid transition in animator
      setTimeout(
        () =>
          getCarouselNavHeaderChildrenArray().forEach((element: HTMLElement) =>
            element.setAttribute('data-status', 'carouselNavHeaderIn')
          ),
        1000
      );
    } else {
      // Mount animator
      getCarouselNavHeaderChildrenArray().forEach((element: HTMLElement) =>
        element.setAttribute('data-status', 'carouselNavHeaderIn')
      );
    }
  }, [featureState]);

  /** Section Right 'Menu' animator */

  const animatorLine = (reference: HTMLSpanElement) => {
    if (reference && !animatorLineArray.current.includes(reference)) animatorLineArray.current.push(reference);
  };

  return (
    <header className='carouselNav'>
      <section className='carouselNav__section'>
        <div className='carouselNav__section__left' ref={carouselNavSectionLeft}>
          <h2>Navigate projects by number</h2>
          <span className='carouselNav__section__left--location'>{`Project 0${projectSlideIndex + 1}.`}</span>
          <nav className='carouselNav__section__left__projectNav' aria-labelledby='project-navigation'>
            <ul ref={unorderedListRef}>
              {projectData.map((_, index) => (
                <li key={_.key + index}>
                  <button
                    className={`${projectSlideIndex === index ? 'projectNavButtonActive' : ''}`}
                    id='project-navigation'
                    aria-label={`View ${_.key} Project`}
                    onPointerUp={() => setProjectSlideIndex(index)}
                  >
                    0{index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <section
        className='carouselNav__section'
        onPointerOver={() => {
          carouselNavSectionRightNav.current?.setAttribute('data-status', 'hovered');
          animatorLineArray.current?.forEach((line: HTMLSpanElement) => line.setAttribute('data-status', 'active'));
        }}
        onPointerLeave={() => {
          carouselNavSectionRightNav.current?.removeAttribute('data-status');
          animatorLineArray.current?.forEach((line: HTMLSpanElement) => line.removeAttribute('data-status'));
        }}
      >
        <div className='carouselNav__section__right' ref={carouselNavSectionRight}>
          <h2>External Links</h2>
          <nav
            className='carouselNav__section__right__nav'
            aria-labelledby='external-links'
            ref={carouselNavSectionRightNav}
          >
            <Link
              to='https://github.com/jbarkergit'
              id='external-links'
              target='_blank'
              aria-label='Visit GitHub Profile'
            >
              GitHub
            </Link>
            <Link
              to='https://leetcode.com/u/jbarkerlc/'
              id='external-links'
              target='_blank'
              aria-label='Visit LeetCode Profile'
            >
              LeetCode
            </Link>
            <button
              aria-label='Contact'
              onPointerUp={() =>
                featureState.contactFormActive
                  ? setFeatureState({ ...featureState, contactFormActive: false })
                  : setFeatureState({ ...featureState, contactFormActive: true })
              }
            >
              Contact
            </button>
          </nav>
          <div className='carouselNav__section__right__animator' ref={carouselNavSectionRightAnimator}>
            <span className='carouselNav__section__right__animator--line' ref={animatorLine} />
            <span className='carouselNav__section__right__animator--line' ref={animatorLine} />
            <span className='carouselNav__section__right__animator--line' ref={animatorLine} />
          </div>
        </div>
      </section>
    </header>
  );
};

export default PortHeader;
