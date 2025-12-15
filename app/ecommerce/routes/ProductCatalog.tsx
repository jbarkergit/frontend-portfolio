import { useLocation } from 'react-router';
import EFooter from '../components/navigation/footer/eFooter';
import ProductProvider from '../components/product/product-provider/ProductProvider';
import { CartProvider } from '../context/CartContext';
import ConditionallyRenderedProductFilters from '../features/product-filters/ConditionallyRenderedProductFilters';
import ProductFilterConstructor from '../features/product-filters/ProductFilterConstructor';
import EcoHeader from '../components/navigation/header-desktop/EcoHeader';
import type { JSX } from 'react';
import { commerceData } from 'app/ecommerce/data/commerceData';

const ProductCatalog = (): JSX.Element => {
  const CompanyFilter = (): JSX.Element => ProductFilterConstructor('Filter by Company', commerceData.companies);
  let breadcrumb: string | undefined = useLocation().pathname.replace(/(ecommerce|\W)+/g, ' ');

  if (breadcrumb && breadcrumb.includes('products ')) {
    const crumb = breadcrumb.split('products ')[1];
    breadcrumb = crumb;
  } else {
    breadcrumb = '';
  }

  return (
    <CartProvider>
      <div id='ecommerce'>
        <EcoHeader />
        <section className='browseProduct'>
          <section className='productCatalogTopper'>
            <div
              className='productCatalogTopper__panel breadCrumbs'
              aria-label={breadcrumb}
              tabIndex={0}>
              <h1>{breadcrumb}</h1>
            </div>
            <div className='productCatalogTopper__panel'>
              <ConditionallyRenderedProductFilters />
              <CompanyFilter />
            </div>
          </section>
          <main>
            <ProductProvider />
          </main>
        </section>
        <EFooter />
      </div>
    </CartProvider>
  );
};
export default ProductCatalog;
