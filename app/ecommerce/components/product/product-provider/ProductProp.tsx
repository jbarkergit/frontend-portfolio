import { Link } from 'react-router';
import { type ProductType, useCart } from '../../../context/CartContext';

type ProductPropType = {
  product: ProductType;
};

const ProductProp = ({ product }: ProductPropType) => {
  const { sku, company, unit, description, price, images } = product;
  const { dispatch, REDUCER_ACTIONS } = useCart();

  return (
    <article className='productGrid__product' key={product.sku}>
      <Link
        to={`/ecommerce/products/${sku}`}
        className='productGrid__product__pictureLink'
        aria-label={`Open ${product.company} ${product.unit} product page`}
      >
        <div className='productGrid__product--containedHover'>
          <picture>
            {images ? <img src={images.medium[0]} alt={unit} decoding='async' fetchPriority='high' /> : null}
          </picture>
        </div>
      </Link>
      <div className='productGrid__product__information'>
        <Link to={`/ecommerce/products/${sku}`}>
          <h2>
            {company} {unit}
          </h2>
        </Link>
        <p tabIndex={0}>{description}</p>
        <button
          aria-label={`Add to Cart for $${product.price}`}
          onClick={() => dispatch({ type: REDUCER_ACTIONS.ADD, payload: { ...product, quantity: 1 } })}
        >
          <svg xmlns='http://www.w3.org/2000/svg' width='1.4em' height='1.4em' viewBox='0 0 24 24'>
            <path
              fill='hsl(0, 0%, 100%)'
              d='M2.237 2.288a.75.75 0 1 0-.474 1.423l.265.089c.676.225 1.124.376 1.453.529c.312.145.447.262.533.382c.087.12.155.284.194.626c.041.361.042.833.042 1.546v2.672c0 1.367 0 2.47.117 3.337c.12.9.38 1.658.982 2.26c.601.602 1.36.86 2.26.981c.866.117 1.969.117 3.336.117H18a.75.75 0 0 0 0-1.5h-7c-1.435 0-2.436-.002-3.192-.103c-.733-.099-1.122-.28-1.399-.556c-.235-.235-.4-.551-.506-1.091h10.12c.959 0 1.438 0 1.814-.248c.376-.248.565-.688.943-1.57l.428-1c.81-1.89 1.215-2.834.77-3.508C19.533 6 18.506 6 16.45 6H5.745a8.996 8.996 0 0 0-.047-.833c-.055-.485-.176-.93-.467-1.333c-.291-.404-.675-.66-1.117-.865c-.417-.194-.946-.37-1.572-.58l-.305-.1ZM7.5 18a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Zm9 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Z'
            ></path>
          </svg>
          <span>{Intl.NumberFormat('en-us', { currency: 'USD', style: 'currency' }).format(price)}</span>
        </button>
      </div>
    </article>
  );
};

export default ProductProp;
