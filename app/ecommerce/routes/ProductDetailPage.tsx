// React

// Data
import { commerceDatabase } from 'app/ecommerce/data/commerceDatabase';
import { useState } from 'react';
import { useParams } from 'react-router';
import EFooter from '../components/navigation/footer/eFooter';

// Components
import Header from '../components/navigation/header-desktop/EcoHeader';
import ProductPageDetails from '../components/product/product-page/ProductPageDetails';
import ProductPageImgDisplay from '../components/product/product-page/ProductPageImgDisplay';
import ProductPageImgSelect from '../components/product/product-page/ProductPageImgSelect';
import MoreLikeThis from '../components/product/product-recommenders/MoreLikeThis';
import type { ProductType } from '../context/CartContext';
// Context
import { CartProvider } from '../context/CartContext';

const ProductDetailPage = () => {
  const { paramId } = useParams() as { paramId: string };
  const findProduct = commerceDatabase.find((product: ProductType) => product.sku === paramId)!;
  const [activeDisplay, setActiveDisplay] = useState<number>(0);

  return (
    <CartProvider>
      <div id='ecommerce'>
        <Header />
        <div className='skuPage'>
          <main className='skuPage__grid'>
            {findProduct.images!.small.length > 1 ? (
              <ProductPageImgSelect findProduct={findProduct} setActiveDisplay={setActiveDisplay} />
            ) : null}
            <ProductPageImgDisplay
              findProduct={findProduct}
              activeDisplay={activeDisplay}
              setActiveDisplay={setActiveDisplay}
            />
            <ProductPageDetails findProduct={findProduct} />
          </main>
          <MoreLikeThis findProduct={findProduct} />
        </div>
        <EFooter />
      </div>
    </CartProvider>
  );
};

export default ProductDetailPage;
