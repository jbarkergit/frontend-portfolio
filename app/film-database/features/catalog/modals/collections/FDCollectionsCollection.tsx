import GenericCarouselNavigation from 'app/film-database/components/carousel/GenericCarouselNavigation';
import type { TmdbMovieProvider } from 'app/film-database/composables/types/TmdbResponse';
import { useModalTrailerContext } from 'app/film-database/context/ModalTrailerContext';
import { type UserCollection, useUserCollectionContext } from 'app/film-database/context/UserCollectionContext';
import { findEuclidean } from 'app/film-database/utility/findEuclidean';
import { forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import FDCollectionsCollectionHeader from './FDCollectionsCollectionHeader';
import FDCollectionsCollectionUl from './FDCollectionsCollectionUl';

const NOT_FOUND_INDEX = -1 as const;

export type Sensor = {
  isInteract: boolean;
  initialPointerCoords: Record<'x' | 'y', number | null>;
  pointerCoords: Record<'x' | 'y', number | null>;
};

const createSensorDefault = (): Sensor => ({
  isInteract: false,
  initialPointerCoords: { x: null, y: null },
  pointerCoords: { x: null, y: null },
});

export type Source = {
  colIndex: number;
  listItem: HTMLLIElement | null;
  listItemIndex: number;
};

const createSourceDefault = (): Source => ({
  colIndex: NOT_FOUND_INDEX,
  listItem: null,
  listItemIndex: NOT_FOUND_INDEX,
});

export type Target = {
  colIndex: number;
  listItemIndex: number;
};

const createTargetDefault = (): Target => ({
  colIndex: NOT_FOUND_INDEX,
  listItemIndex: NOT_FOUND_INDEX,
});

type Props = {
  mapIndex: number;
  header: string;
  data: TmdbMovieProvider[] | null;
  isEditMode: boolean;
  ulRefs: React.RefObject<HTMLUListElement[]>;
  triggerError: () => void;
};

const FDCollectionsCollection = memo(
  forwardRef<HTMLUListElement, Props>(({ mapIndex, header, data, isEditMode, ulRefs, triggerError }, ref) => {
    // References
    const grandChildRef = useRef<HTMLUListElement>(null);
    useImperativeHandle(ref, () => grandChildRef.current!, [grandChildRef]);

    // Context
    const { userCollections, setUserCollections } = useUserCollectionContext();
    const { setModalTrailer } = useModalTrailerContext();

    // Precomputations
    const sensorDefault = useMemo(() => createSensorDefault(), []); // Sensor
    const sourceDefault = useMemo(() => createSourceDefault(), []); // Source
    const targetDefault = useMemo(() => createTargetDefault(), []); // Target

    // Stores
    const sensorRef = useRef<Sensor>(sensorDefault); // Sensor
    const sourceRef = useRef<Source>(sourceDefault); // Source
    const targetRef = useRef<Target>(targetDefault); // Target

    /** Rolls stores back to default state */
    const resetStores = (): void => {
      sensorRef.current = sensorDefault;
      sourceRef.current = sourceDefault;
      targetRef.current = targetDefault;
    };

    /** Prepare dom for new potential interactions */
    function resetInteraction(error?: { event: 'down' | 'move' | 'up' | 'attach' | 'detach'; reason: string }): void {
      // Remove target's inline styles and event listeners
      if (sourceRef.current.listItem instanceof HTMLLIElement) {
        if (sourceRef.current.listItem.hasAttribute('style')) {
          sourceRef.current.listItem.removeAttribute('style');
        }
        sourceRef.current.listItem.removeEventListener('pointermove', attachListItem);
      }

      // Re-attach (remove first to guarantee single registration)
      const ul = grandChildRef.current;

      if (ul) {
        ul.removeEventListener('pointermove', pointerMove);
        ul.removeEventListener('pointerup', pointerUp);

        ul.addEventListener('pointermove', pointerMove);
        ul.addEventListener('pointerup', pointerUp);
      }

      // Rollback sensors
      resetStores();

      // Log errors
      if (error) console.error(`Event ${error.event.toLocaleUpperCase()} failed. ${error.reason}`);
    }

    /** Sets modal trailer */
    function handleModalTrailer(): void {
      const ul = grandChildRef.current;
      const listItems: Element[] | null = ul ? Array.from(ul.children) : null;

      if (!listItems) {
        resetInteraction({ event: 'up', reason: 'Failure to identify list items.' });
        return;
      }

      const elementIndex: number = listItems.findIndex((item) => item === sourceRef.current.listItem);

      if (elementIndex == NOT_FOUND_INDEX) {
        resetInteraction({ event: 'up', reason: 'Element index not found.' });
        return;
      }

      for (let i = 0; i < listItems.length; i++) {
        listItems[i]?.setAttribute('data-list-item-visible', i === elementIndex ? 'true' : 'false');
      }

      const collectionData = Object.values(userCollections)[mapIndex]?.data;
      const targetData = collectionData?.[elementIndex];
      if (targetData) setModalTrailer(targetData);

      resetInteraction();
    }

    function attachListItem(event: PointerEvent): void {
      /** Attaches active list item to cursor */
      const { x, y } = sensorRef.current.pointerCoords;
      const li = sourceRef.current.listItem;

      if (!li || x === null || y === null) return;

      const rect: DOMRect = li.getBoundingClientRect();
      const offsetX = event.clientX - rect.width / 2;
      const offsetY = event.clientY - rect.height / 2;

      li.style.cssText = `position: fixed; z-index: 2; left: ${offsetX}px; top: ${offsetY}px;`;
      sensorRef.current.pointerCoords = { x: event.clientX, y: event.clientY };
    }

    /** Detaches active list item from cursor, handles transfer of list item inbetween collections */
    function detachListItem(event: PointerEvent): void {
      const { x: startX, y: startY } = sensorRef.current.initialPointerCoords; // Attachment position
      const detach: Record<'x' | 'y', number> = { x: event.clientX, y: event.clientY }; // Detachment position

      // Misclick threshold (Euclidean distance)
      if (Math.hypot(detach.x - (startX ?? 0), detach.y - (startY ?? 0)) < 10) {
        resetInteraction();
        return;
      }

      // Identify target collection index
      const collectionRects: DOMRect[] = ulRefs.current.map((col) => col.getBoundingClientRect());
      const targetCollectionIndex = findEuclidean(detach, collectionRects);

      if (targetCollectionIndex == NOT_FOUND_INDEX) {
        resetInteraction({ event: 'detach', reason: 'Failure to identify target index.' });
        return;
      }

      targetRef.current.colIndex = targetCollectionIndex;

      // Get target collection's list item rects
      const targetCol = ulRefs.current[targetCollectionIndex];

      if (!targetCol) {
        resetInteraction({
          event: 'detach',
          reason: 'Failure to identify target index within unordered list reference array.',
        });
        return;
      }

      const targetColListItems: (HTMLLIElement | HTMLDivElement)[] = Array.from(targetCol.children) as Array<
        HTMLDivElement | HTMLLIElement
      >;
      const targetColRects: DOMRect[] = targetColListItems.map((li) => li.getBoundingClientRect());

      // Find the closest item index to the detach point
      const targetListIndex: number = findEuclidean(detach, targetColRects);

      if (targetListIndex == NOT_FOUND_INDEX) {
        resetInteraction({ event: 'detach', reason: 'Failure to identify euclidean.' });
        return;
      }

      targetRef.current.listItemIndex = targetListIndex;

      // Capture source information prior to state sets to avoid mutable ref issues
      const sourceKey = Object.keys(userCollections)[sourceRef.current.colIndex];
      const targetKey = Object.keys(userCollections)[targetCollectionIndex];

      if (
        sourceRef.current.colIndex === NOT_FOUND_INDEX ||
        sourceRef.current.listItemIndex === NOT_FOUND_INDEX ||
        !sourceKey ||
        !targetKey
      ) {
        resetInteraction({ event: 'detach', reason: 'Invalid source and/or target keys.' });
        return;
      }

      // Establish flag determining if the dragged list item is dropped in the same collection at the same position
      const isSameCollection: boolean = sourceRef.current.colIndex === targetCollectionIndex;
      const isSameListItemIndex: boolean = sourceRef.current.listItemIndex === targetListIndex;
      const isFaultyInteraction: boolean = isSameCollection && isSameListItemIndex;

      // Update carousels when user drags a list item to a collection and drops it in a new position
      setUserCollections((prevCarousels) => {
        if (isFaultyInteraction) return prevCarousels;

        const prevSourceData = prevCarousels[sourceKey]?.data as TmdbMovieProvider[];
        const prevTargetData = prevCarousels[targetKey]?.data as TmdbMovieProvider[];

        // Determine if the dragged list item is dropped in a target collection (not source collection for reordering) that already contains the list item
        const targetIncludesListItem: boolean =
          !isSameCollection &&
          prevTargetData.some((item) => item.id === prevSourceData[sourceRef.current.listItemIndex]?.id);

        if (targetIncludesListItem) {
          triggerError();
          return prevCarousels;
        }

        let newSourceData: TmdbMovieProvider[];
        let newTargetData: TmdbMovieProvider[];

        if (isSameCollection) {
          // Reordering within the same collection
          newSourceData = [...prevSourceData];
          const [movedItem] = newSourceData.splice(sourceRef.current.listItemIndex, 1); // Remove original
          if (!movedItem) return prevCarousels;
          newSourceData.splice(targetListIndex, 0, movedItem); // Insert at new index
          newTargetData = newSourceData; // Same array for source and target
        } else {
          // Moving to target collection
          newSourceData = prevSourceData.filter((_, index) => index !== sourceRef.current.listItemIndex);
          const movedItem = structuredClone(prevSourceData[sourceRef.current.listItemIndex]);
          if (!movedItem) return prevCarousels;
          newTargetData = [
            ...prevTargetData.slice(0, targetListIndex),
            movedItem,
            ...prevTargetData.slice(targetListIndex),
          ];
        }

        return {
          ...prevCarousels,
          [sourceKey]: {
            ...prevCarousels[sourceKey]!,
            data: newSourceData,
          } as UserCollection,
          [targetKey]: {
            ...prevCarousels[targetKey]!,
            data: newTargetData,
          } as UserCollection,
        };
      });

      resetInteraction();
    }

    /** Sets interactivity in motion by toggling a flag and assigning dependency values */
    function pointerDown(event: PointerEvent): void {
      const currentTarget: EventTarget | null = event.currentTarget;
      const target: EventTarget | null = event.target;

      if (!(currentTarget instanceof HTMLUListElement) || !(target instanceof HTMLLIElement)) return;

      // Prevent dragging of the collection container
      event.preventDefault();
      event.stopPropagation();

      // Find collection (UL) index
      const colIndex = ulRefs.current.findIndex((collection) => collection === currentTarget);

      if (colIndex === NOT_FOUND_INDEX) {
        resetInteraction({ event: 'down', reason: 'Source collection index not found.' });
        return;
      }

      // Identify UL
      const srcColUl = ulRefs.current[colIndex];

      if (!srcColUl) {
        resetInteraction({ event: 'down', reason: 'Source UL not found.' });
        return;
      }

      // Find index of LI within the collection (UL)
      const liElements = Array.from(srcColUl.children) as Array<HTMLLIElement | HTMLDivElement>;
      const targetIndex = liElements.findIndex((li) => li === target);

      if (targetIndex === NOT_FOUND_INDEX) {
        resetInteraction({ event: 'down', reason: 'Source list item index not found.' });
        return;
      }

      // Assignments
      sourceRef.current = {
        colIndex,
        listItem: target,
        listItemIndex: targetIndex,
      };

      sensorRef.current = {
        ...sensorRef.current,
        isInteract: true,
        initialPointerCoords: { x: event.clientX, y: event.clientY },
        pointerCoords: { x: event.clientX, y: event.clientY },
      };
    }

    /** Tracks collections and their items */
    function pointerMove(event: PointerEvent): void {
      if (!isEditMode || !sensorRef.current.isInteract || !(sourceRef.current.listItem instanceof HTMLLIElement)) {
        resetInteraction();
        return;
      }

      attachListItem(event);
    }

    /** Scales all list items and applies filters to their images then invokes resetInteraction */
    function pointerUp(event: PointerEvent): void {
      if (isEditMode) detachListItem(event);
      else handleModalTrailer();
    }

    /** Handles module's event listeners */
    useEffect(() => {
      const ul = grandChildRef.current;
      if (!ul) return;

      ul.addEventListener('pointerdown', pointerDown);
      if (isEditMode) ul.addEventListener('pointermove', pointerMove);
      ul.addEventListener('pointerup', pointerUp);

      return () => {
        ul.removeEventListener('pointerdown', pointerDown);
        ul.removeEventListener('pointermove', pointerMove);
        ul.removeEventListener('pointerup', pointerUp);
      };
    }, [isEditMode, userCollections]);

    if (data)
      return (
        <section className='fdCollections__collection'>
          <FDCollectionsCollectionHeader mapIndex={mapIndex} header={header} />
          <div className='fdCollections__collection__wrapper'>
            <FDCollectionsCollectionUl
              mapIndex={mapIndex}
              data={data}
              isEditMode={isEditMode}
              ref={grandChildRef}
              sensorRef={sensorRef}
            />
            <GenericCarouselNavigation dataLength={data.length} reference={grandChildRef} isModal={true} />
          </div>
        </section>
      );
  })
);
export default FDCollectionsCollection;
