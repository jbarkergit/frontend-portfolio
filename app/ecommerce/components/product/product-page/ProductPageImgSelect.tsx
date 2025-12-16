import type { Dispatch, SetStateAction } from 'react';
import type { ProductType } from '../../../context/CartContext';

type PropType = {
  findProduct: ProductType;
  setActiveDisplay: Dispatch<SetStateAction<number>>;
};

const ProductPageImgSelect = ({ findProduct, setActiveDisplay }: PropType) => {
  const { company, images, unit } = findProduct;

  return (
    <aside className='skuPage__grid__imgSelection'>
      {images?.small.map((image, index) => (
        <picture key={`product-image-select-${index}`}>
          <img
            src={image}
            alt={company + unit}
            decoding='async'
            fetchPriority='high'
            onClick={() => setActiveDisplay(index)}
            tabIndex={0}
          />
        </picture>
      ))}
    </aside>
  );
};

export default ProductPageImgSelect;
