import { useFeatureState } from 'app/portfolio/context/FeatureStateContext';
import Contact from 'app/portfolio/features/contact/Contact';
import ProjectInsights from 'app/portfolio/features/insights/ProjectInsights';
import ProjectCarousel from 'app/portfolio/features/preview/carousel/ProjectCarousel';
import PortFooter from 'app/portfolio/features/preview/navigation/footer/PortFooter';
import PortHeader from 'app/portfolio/features/preview/navigation/header/PortHeader';
import { useEffect } from 'react';

const PortGrid = ({ portfolioRef }: { portfolioRef: React.RefObject<HTMLDivElement | null> }) => {
  const { featureState } = useFeatureState();

  // Scroll to a specific child in the portfolio grid
  const useFeatureScroll = (index: number, behavior: ScrollBehavior): void => {
    const delay: 0 | 400 = Object.values(featureState).some(Boolean) ? 400 : 0;

    setTimeout(() => {
      const project = portfolioRef.current?.children[index] as HTMLElement | undefined;

      if (project) {
        portfolioRef.current?.scrollTo({
          left: project.offsetLeft,
          top: project.offsetTop,
          behavior,
        });
      }
    }, delay);
  };

  // Determines the active grid index based on feature state
  const getActiveGridIndex = (index?: number): number => {
    if (featureState.projectDetailsActive) return 1;
    if (featureState.contactFormActive) return 2;
    return index ?? 0;
  };

  // Handles scroll behavior based on state or argument index
  const useFeatureScrollHandler = (behavior: ScrollBehavior, index?: number): void => {
    const activeIndex = getActiveGridIndex(index);
    useFeatureScroll(activeIndex, behavior);
  };

  // Triggers scroll animation on mount and handles scroll position on window resize
  useEffect(() => {
    useFeatureScrollHandler('smooth');

    const handleResize = () => {
      const activeIndex = getActiveGridIndex();
      useFeatureScrollHandler('instant', activeIndex);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [featureState]);

  return (
    <>
      <section className='projectHub'>
        <h2>Project hub</h2>
        <PortHeader />
        <ProjectCarousel />
        <PortFooter />
      </section>
      <ProjectInsights />
      <Contact />
    </>
  );
};

export default PortGrid;
