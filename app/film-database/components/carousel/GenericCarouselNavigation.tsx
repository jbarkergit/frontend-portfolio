import { IcBaselineArrowLeft, IcBaselineArrowRight } from 'app/film-database/assets/svg/icons';
import { useVisibleCountContext } from 'app/film-database/context/VisibleCountContext';
import { useRef, useCallback, useEffect, useState, useLayoutEffect, type RefObject, memo } from 'react';

type Props = {
  dataLength: number;
  reference: RefObject<HTMLUListElement | null>;
  isModal: boolean;
};

const GenericCarouselNavigation = memo(({ dataLength, reference, isModal }: Props) => {
  const [forceRerender, setForceRerender] = useState(false);

  useLayoutEffect(() => {
    if (reference.current) setForceRerender(true);
  }, []);

  const { visibleCount } = useVisibleCountContext();

  const itemsPerPage = !isModal ? visibleCount.viewport : visibleCount.modal;
  const indexRef = useRef(0);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!reference.current) return;

      const listItems = Array.from(reference.current.children) as HTMLElement[];
      if (listItems.length === 0) return;

      const targetIndex = Math.min(index * itemsPerPage, listItems.length - 1);
      const targetEl = listItems[targetIndex];
      if (!targetEl) return;

      const firstItem = listItems[0];
      if (!firstItem) return;

      const marginLeft =
        parseInt(getComputedStyle(firstItem).marginLeft) || parseInt(getComputedStyle(reference.current).paddingLeft);

      const scrollPosition = targetEl.offsetLeft - reference.current.offsetLeft;

      const adjustedScroll =
        targetIndex === 0
          ? scrollPosition - marginLeft
          : targetIndex >= listItems.length
            ? scrollPosition + marginLeft
            : scrollPosition;

      reference.current.scrollTo({ left: adjustedScroll, behavior: 'smooth' });
    },
    [itemsPerPage]
  );

  const navigate = useCallback(
    (delta: number) => {
      const maxIndex = Math.ceil(dataLength / itemsPerPage) - 1;
      indexRef.current = Math.max(0, Math.min(indexRef.current + delta, maxIndex));
      scrollToIndex(indexRef.current);
    },
    [itemsPerPage]
  );

  // Re-align when itemsPerPage changes (resize)
  useEffect(() => {
    indexRef.current = 0;
    navigate(0);
  }, [itemsPerPage]);

  return (
    <nav className='genericCarousel__wrapper__navigation'>
      <button
        className='genericCarousel__wrapper__navigation--button'
        aria-label='Show Previous'
        onClick={() => navigate(-1)}>
        <IcBaselineArrowLeft />
      </button>
      <button
        className='genericCarousel__wrapper__navigation--button'
        aria-label='Show More'
        onClick={() => navigate(1)}>
        <IcBaselineArrowRight />
      </button>
    </nav>
  );
});

export default GenericCarouselNavigation;
