import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';

const ProductFilterConstructor = (initFilterName: string, filterData: string[] | Set<string>) => {
  //** react-router hooks (must be stored in variable) */
  const location: string = useLocation().pathname.replace('/ecommerce/', '');

  /** Modal References */
  const selectMenuRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLUListElement>(null);

  /** Filter Name State, takes initFilterName parameter as initial state */
  const [filterName, setFilterName] = useState<string>(initFilterName);

  //** Toggle State Dependency */
  const [modalStatus, setModalStatus] = useState<boolean>(false);

  /** Checks filterData for array and set data structures */
  const useFilterData: () => string[] = () => {
    if (Array.isArray(filterData)) return filterData;
    else if (filterData instanceof Set) throw new Error('useFilterData only accepts Arrays');
    else throw new Error('Filter Data Type may be void or returning null');
  };

  /** Handle naming of product filters */
  useEffect(() => {
    const locationName = useFilterData().find((data) => data === location);
    if (locationName) setFilterName(locationName);
    else setFilterName(initFilterName);
  }, [location]);

  //** Modal data-attr toggle && external click handler */
  useEffect(() => {
    //Toggle Modal Data Attribute
    if (accordionRef.current) accordionRef.current.setAttribute('data-status', modalStatus ? 'active' : 'false');

    //toggles modalStatus to false if document.body is clicked, stops bubbling if selectMenu || button clicked
    const handleExteriorClick = (e: PointerEvent): void => {
      const target = e.target as HTMLElement;
      selectMenuRef.current?.contains(target) || accordionRef.current?.contains(target)
        ? e.stopPropagation
        : setModalStatus(false);
    };

    document.body.addEventListener('pointerdown', handleExteriorClick);
    return () => document.body.removeEventListener('pointerdown', handleExteriorClick);
  }, [modalStatus]);

  return (
    <section className='productFilter' tabIndex={0}>
      <div
        className='productFilter__select'
        ref={selectMenuRef}
        onClick={() => (modalStatus ? setModalStatus(false) : setModalStatus(true))}
      >
        <span className='productFilter__select--area'>{filterName}</span>
        <span className='productFilter__select--area'>
          <svg xmlns='http://www.w3.org/2000/svg' width='0.79em' height='1.25em' viewBox='0 0 320 512'>
            <path
              fill='#ffffff'
              d='M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z'
            ></path>
          </svg>
        </span>
      </div>
      <ul className='productFilter__accordion' data-status='false' ref={accordionRef}>
        {useFilterData().map((data: string) => (
          <li className='productFilter__accordion__listItem' key={`accordion-product-filter-${data}`}>
            <label className='productFilter__accordion__listItem--label' htmlFor={data}>
              {data}
            </label>
            <Link
              to={`/ecommerce/products/${data}`}
              className='productFilter__accordion__listItem--option'
              aria-label={`Filter by ${data}`}
              id={data}
              onClick={() => {
                setModalStatus(modalStatus ? false : true);
              }}
            >
              {data}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductFilterConstructor;
