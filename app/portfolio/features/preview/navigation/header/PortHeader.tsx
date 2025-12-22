import { useFeatureState } from 'app/portfolio/context/FeatureStateContext';
import { useProjectSlideIndex } from 'app/portfolio/context/ProjectSlideContext';
import { projectData } from 'app/portfolio/data/projectData';
import { type SVGProps, useEffect, useRef } from 'react';
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
              <span>
                <MdiGithubBox />
              </span>
              <span>GitHub</span>
            </Link>
            <Link
              to='https://leetcode.com/u/jbarkerlc/'
              id='external-links'
              target='_blank'
              aria-label='Visit LeetCode Profile'
            >
              <span>
                <TablerBrandLeetcode />
              </span>
              <span>LeetCode</span>
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

export function MdiGithubBox(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
      <path
        d='M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4.44c-.32-.07-.33-.68-.33-.89l.01-2.47c0-.84-.29-1.39-.61-1.67c2.01-.22 4.11-.97 4.11-4.44c0-.98-.35-1.79-.92-2.42c.09-.22.4-1.14-.09-2.38c0 0-.76-.23-2.48.93c-.72-.2-1.48-.3-2.25-.31c-.76.01-1.54.11-2.25.31c-1.72-1.16-2.48-.93-2.48-.93c-.49 1.24-.18 2.16-.09 2.38c-.57.63-.92 1.44-.92 2.42c0 3.47 2.1 4.22 4.1 4.47c-.26.2-.49.6-.57 1.18c-.52.23-1.82.63-2.62-.75c0 0-.48-.86-1.38-.93c0 0-.88 0-.06.55c0 0 .59.28 1 1.32c0 0 .52 1.75 3.03 1.21l.01 1.53c0 .21-.02.82-.34.89H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z'
        fill='currentColor'
      />
    </svg>
  );
}
export function TablerBrandLeetcode(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      {/* Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE */}
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M12 13h7.5M9.424 7.268l4.999-4.999m2.21 14.375l-2.402 2.415a3.19 3.19 0 0 1-4.524 0l-3.77-3.787a3.223 3.223 0 0 1 0-4.544l3.77-3.787a3.19 3.19 0 0 1 4.524 0l2.302 2.313'
      />
    </svg>
  );
}
