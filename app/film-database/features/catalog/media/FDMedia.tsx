import GenericCarousel from 'app/film-database/components/carousel/GenericCarousel';
import { useModalContext } from 'app/film-database/context/ModalContext';
import FDSearch from 'app/film-database/features/catalog/media/search/FDSearch';
import { useFLoader } from 'app/film-database/routes/FilmDatabase';
import { useEffect, useRef } from 'react';

const FDMedia = () => {
  const { modal } = useModalContext();
  const { primaryData } = useFLoader();
  const fdMediaRef = useRef<HTMLElement>(null);

  /**
   * Carousel deltaY scroll logic
   * Update previously active and newly active carousel node's data-attr, navigate
   */
  let canScroll: boolean = true;

  const deltaScrollCarousels = (delta: 1 | -1): void => {
    if (!canScroll || window.innerWidth <= 1501 || !fdMediaRef.current) return;

    canScroll = false;

    const carouselNodesArr: Element[] = [...fdMediaRef.current.children];

    // Gather indexes
    const activeNodeIndex: number = carouselNodesArr.findIndex(
      (node: Element) => node.getAttribute('data-anim') === 'active'
    );
    const nextActiveNodeIndex: number = Math.max(0, Math.min(activeNodeIndex + delta, carouselNodesArr.length - 1));

    // Handle attributes
    if (nextActiveNodeIndex !== activeNodeIndex) {
      if (carouselNodesArr[activeNodeIndex] && nextActiveNodeIndex > activeNodeIndex) {
        carouselNodesArr[activeNodeIndex].setAttribute('data-anim', 'disabled');
      }
      if (carouselNodesArr[nextActiveNodeIndex])
        carouselNodesArr[nextActiveNodeIndex].setAttribute('data-anim', 'active');
    }

    // Scroll
    const nextActiveNodeOffsetTop: number = (carouselNodesArr[nextActiveNodeIndex] as HTMLElement).offsetTop;
    fdMediaRef.current.style.top = `${nextActiveNodeOffsetTop * -1 - 25}px`;

    // Throttle
    setTimeout(() => (canScroll = true), 200);
  };

  const handleWheel = (event: WheelEvent) => deltaScrollCarousels(event.deltaY > 0 ? 1 : -1);

  /** Event Listeners */
  useEffect(() => {
    if (!modal) window.addEventListener('wheel', handleWheel);
    else window.removeEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [fdMediaRef.current, modal]);

  /** Handle resize */
  useEffect(() => {
    const attr = 'data-anim';

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width } = entry.contentRect;

      if (fdMediaRef.current && width <= 1501) {
        fdMediaRef.current.style.top = `0px`;
        const children = fdMediaRef.current.children;
        if (children) for (const child of children) child.setAttribute(attr, 'active');
      }
    });

    if (fdMediaRef.current) observer.observe(fdMediaRef.current);
    return () => observer.disconnect();
  }, []);

  /** JSX */
  return (
    <main className='fdMedia' ref={fdMediaRef} style={{ top: '0px' }}>
      {primaryData.map(({ key, response }, index) => (
        <GenericCarousel
          carouselIndex={index}
          carouselName={'media'}
          heading={key}
          data={response.results}
          key={`media-carousel-${index}`}
        />
      ))}
      <FDSearch orientation='desktop' />
    </main>
  );
};

export default FDMedia;
