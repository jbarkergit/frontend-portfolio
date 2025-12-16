import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { ProductType } from '../../../context/CartContext';

type PropType = {
  findProduct: ProductType;
  activeDisplay: number;
  setActiveDisplay: Dispatch<SetStateAction<number>>;
};

const ProductPageImgDisplay = ({ findProduct, activeDisplay, setActiveDisplay }: PropType) => {
  const { company, images, unit } = findProduct; //Prop drilled logic to find product based on useParams
  const lastSlide = findProduct.images!.large.length - 1; //Index of last img in product img array

  //FEATURE: Magnifier
  const primaryImgContainer = useRef<HTMLDivElement>(null),
    primaryImg = useRef<HTMLImageElement>(null),
    magnifier = useRef<HTMLImageElement>(null);

  const [magnifierEnabled, setMagnifierEnabled] = useState<boolean>(false),
    [cursorCoordinates, setCursorCoordinates] = useState<{ x: number; y: number }>({ x: 0, y: 0 }),
    [magnifierBackgroundSize, setMagnifierBackgroundSize] = useState<{ width: string; height: string }>({
      width: '',
      height: '',
    }),
    [magnifierBackgroundPos, setMagnifierBackgroundPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 }),
    [magnification, setMagnification] = useState<number>(1);

  useEffect(() => {
    //Enable magnifier, set initial cursor pos
    const userPointerUp = (e: PointerEvent): void => {
      if (magnifierEnabled) {
        setMagnifierEnabled(false);
      } else {
        setCursorCoordinates({ x: e.offsetX, y: e.offsetY + 80 });
        setMagnifierEnabled(true);
      }
    };

    //Increment & decrement magnification by prefered scaling ratio via scroll direction
    const userWheel = (e: WheelEvent): void => {
      if (magnifierEnabled) {
        e.preventDefault(); //Prevent page scroll
        const minMaxMagnify = { min: 1, max: 1.6 }; //Range setter
        const clampedMagnification = Math.min(
          minMaxMagnify.max,
          Math.max(minMaxMagnify.min, magnification + (e.deltaY < 0 ? 0.2 : -0.2))
        );
        setMagnification(clampedMagnification);
      }
    };

    //Set cursor coordinates on pointer move
    const userPointerMove = (e: PointerEvent) => {
      if (magnifierEnabled) setCursorCoordinates({ x: e.offsetX, y: e.offsetY + 80 });
    };

    //Disable magnifier on pointer leave
    const userPointerLeave = (): void => setMagnifierEnabled(false);

    primaryImg.current?.addEventListener('pointerup', userPointerUp);
    primaryImg.current?.addEventListener('wheel', userWheel);
    primaryImg.current?.addEventListener('pointermove', userPointerMove);
    primaryImg.current?.addEventListener('pointerleave', userPointerLeave);

    return () => {
      primaryImg.current?.removeEventListener('pointerup', userPointerUp);
      primaryImg.current?.removeEventListener('wheel', userWheel);
      primaryImg.current?.removeEventListener('pointermove', userPointerMove);
      primaryImg.current?.removeEventListener('pointerleave', userPointerLeave);
    };
  }, [primaryImg.current, magnifierEnabled, magnification]);

  //Set magnifier image position based on cursor coordinates and magnification
  useEffect(() => {
    if (magnifierEnabled && magnifier.current) {
      const backgroundPosX = cursorCoordinates.x * magnification - magnifier.current.offsetWidth / 2;
      const backgroundPosY = cursorCoordinates.y * magnification - magnifier.current.offsetHeight / 2 - 80;
      setMagnifierBackgroundPos({ x: backgroundPosX, y: backgroundPosY });
    }
  }, [magnifier.current, cursorCoordinates, magnifierBackgroundSize]);

  //Set magnifier image size, by passes container wxh inheritance
  useEffect((): void => {
    if (primaryImg.current)
      setMagnifierBackgroundSize({
        width: `${primaryImg.current.width * magnification}px`,
        height: `${primaryImg.current.height * magnification}px`,
      });
  }, [primaryImg.current, magnification]);

  // Reset active display index on location change
  useEffect(() => setActiveDisplay(0), [window.location.pathname]);

  return (
    <section className='skuPage__grid__display'>
      <div className='skuPage__grid__display__heading'>
        {company} {unit}
      </div>

      <div className='skuPage__grid__display__primaryImg' ref={primaryImgContainer}>
        {magnifierEnabled ? (
          <div
            className='skuPage__grid__display__primaryImg__magnifier'
            ref={magnifier}
            style={{ transform: `translateX(${cursorCoordinates.x}px) translateY(${cursorCoordinates.y}px)` }}
          >
            <img
              src={images?.large[activeDisplay]}
              style={{
                width: `${magnifierBackgroundSize.width}`,
                height: `${magnifierBackgroundSize.height}`,
                maxWidth: `${magnifierBackgroundSize.width}`,
                maxHeight: `${magnifierBackgroundSize.height}`,
                transform: `translateX(-${magnifierBackgroundPos.x}px) translateY(-${magnifierBackgroundPos.y}px)`,
              }}
            />
          </div>
        ) : null}
        <picture className='skuPage__grid__display__primaryImg--picture'>
          <img
            src={images?.large[activeDisplay]}
            alt={company + unit}
            decoding='async'
            fetchPriority='high'
            ref={primaryImg}
            style={magnifierEnabled ? { cursor: 'none' } : { cursor: 'zoom-in' }}
          />
        </picture>
      </div>
      {images?.large.length === 1 ? null : (
        <div className='skuPage__grid__display__nav'>
          <div className='skuPage__grid__display__nav__container'>
            <button
              aria-label='Previous Image'
              onClick={() => (activeDisplay === 0 ? setActiveDisplay(lastSlide) : setActiveDisplay(activeDisplay - 1))}
            >
              <span>
                <svg xmlns='http://www.w3.org/2000/svg' width='1.8em' height='1.8em' viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='m8.165 11.63l6.63-6.43C15.21 4.799 16 5.042 16 5.57v12.86c0 .528-.79.771-1.205.37l-6.63-6.43a.499.499 0 0 1 0-.74Z'
                  ></path>
                </svg>
                <span>Previous Image</span>
              </span>
            </button>
          </div>
          <div className='skuPage__grid__display__nav__container'>
            <button
              aria-label='Next Image'
              onClick={() => (activeDisplay === lastSlide ? setActiveDisplay(1) : setActiveDisplay(activeDisplay + 1))}
            >
              <span>
                <span>Next Image</span>
                <svg xmlns='http://www.w3.org/2000/svg' width='1.8em' height='1.8em' viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='M15.835 11.63L9.205 5.2C8.79 4.799 8 5.042 8 5.57v12.86c0 .528.79.771 1.205.37l6.63-6.43a.498.498 0 0 0 0-.74Z'
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
export default ProductPageImgDisplay;
