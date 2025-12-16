import type { ProductType } from 'app/ecommerce/context/CartContext';
import { commerceDatabase } from 'app/ecommerce/data/commerceDatabase';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import ProductProp from './ProductProp';

/** Product Display */
const ProductProvider = () => {
  /** Produce filtered, sorted and paginated products */
  const location = useLocation().pathname.split('/').pop() || 'products';

  const paginatedProducts = useMemo(() => {
    const filteredData = commerceDatabase.reduce((result: ProductType[], product: ProductType) => {
      if (product.category) {
        switch (location) {
          case 'products':
            return [...commerceDatabase].sort((a, b) => a.company.localeCompare(b.company));

          case 'headphones':
          case 'microphones':
          case 'interfaces':
            if (Array.isArray(product.category) && product.category.includes(location)) result.push(product);
            else if (typeof product.category === 'string' && product.category.includes(location)) result.push(product);
            break;

          case 'amps-dacs':
            if (
              Array.isArray(product.category) &&
              (product.category as string[]).some((cat) => ['amps', 'dacs', 'amps-dacs'].includes(cat))
            )
              result.push(product);
            else if (typeof product.category === 'string' && ['amps', 'dacs', 'amps-dacs'].includes(product.category))
              result.push(product);
            break;

          default:
            if (product.company?.includes(location)) result.push(product);
            else if (product.wearStyle?.includes(location)) result.push(product);
            else if (product.polarPattern?.includes(location)) result.push(product);
            else
              console.error(
                'Failure at ProductProvider: Location unavailable or property are unavailable in default case.'
              );
        }
      }
      return result;
    }, []);

    const filteredSortedData = [...filteredData].sort((a, b) => a.company.localeCompare(b.company));

    let paginatedData = [];

    for (let i = 0; i < filteredSortedData.length; i += 7) {
      paginatedData.push(filteredSortedData.slice(i, i + 7));
    }

    return paginatedData;
  }, [location]);

  /** Product scroll intersectional observer */
  const [visibleProducts, setVisibleProducts] = useState<ProductType[]>(
    paginatedProducts[0] ? paginatedProducts[0] : []
  );

  const visibleArrayIndex = useRef<number>(0);
  const lastProductRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    visibleArrayIndex.current = 0;
    setVisibleProducts(paginatedProducts[0] ?? []);
  }, [paginatedProducts]);

  useEffect(() => {
    // If the last rendered product is in view and more products can be appended, do so
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (!!entries[0] && entries[0]?.isIntersecting) {
        visibleArrayIndex.current += 1;
        const newProducts = paginatedProducts[visibleArrayIndex.current];
        if (newProducts) setVisibleProducts((state) => [...state, ...newProducts]);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, { root: null, threshold: 0.1 });
    if (lastProductRef.current) observer.observe(lastProductRef.current);

    return () => {
      if (lastProductRef.current) observer.unobserve(lastProductRef.current!);
    };
  }, [visibleProducts.length]);

  return (
    <ul className='productGrid'>
      {visibleProducts.map((product, index) => (
        <li key={product.sku} ref={index === visibleProducts.length - 1 ? lastProductRef : null}>
          <ProductProp product={product} />
        </li>
      ))}
    </ul>
  );
};

export default ProductProvider;
