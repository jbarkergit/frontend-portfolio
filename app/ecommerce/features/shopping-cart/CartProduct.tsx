import { commerceDatabase } from 'app/ecommerce/data/commerceDatabase';
import { type CartProductType, useCart } from '../../context/CartContext';

const CartProducts = () => {
  const { dispatch, REDUCER_ACTIONS, shoppingCart } = useCart();

  return shoppingCart.map((product: CartProductType) => {
    const shoppingCartProductSku: string = product.sku;
    const shoppingCartProductQuantity: number = product.quantity;
    const databaseProductStock: number | undefined = commerceDatabase.find(
      (product) => product.sku === shoppingCartProductSku
    )?.stock;
    const maximumStockMet = shoppingCartProductQuantity === databaseProductStock;

    return (
      <li key={`shopping-cart-product-${product.sku}`}>
        <article className='shoppingCart__products__lineItem'>
          <picture>
            {product.images ? (
              <img
                src={product.images.small[0]}
                alt={product.unit}
                loading='lazy'
                decoding='sync'
                fetchPriority='low'
              />
            ) : null}
          </picture>

          <div className='shoppingCart__products__lineItem__information'>
            <hgroup className='shoppingCart__products__lineItem__information__details'>
              <h2>{`${product.company} ${product.unit} ${Intl.NumberFormat('en-us', { currency: 'USD', style: 'currency' }).format(product.price)}`}</h2>
              <h3>
                {product.company} {product.unit}
              </h3>
              <h4>{Intl.NumberFormat('en-us', { currency: 'USD', style: 'currency' }).format(product.price)}</h4>
            </hgroup>
            <div className='shoppingCart__products__lineItem__information__quantity'>
              <button
                aria-label={`Remove one ${product.company} ${product.unit} from cart`}
                onClick={() => dispatch({ type: REDUCER_ACTIONS.REMOVE, payload: product })}
              >
                <svg xmlns='http://www.w3.org/2000/svg' width='1.1em' height='1.1em' viewBox='0 0 24 24'>
                  <path
                    fill='#ffffff'
                    d='m12.37 15.835l6.43-6.63C19.201 8.79 18.958 8 18.43 8H5.57c-.528 0-.771.79-.37 1.205l6.43 6.63c.213.22.527.22.74 0Z'
                  ></path>
                </svg>
              </button>
              <span>{maximumStockMet ? product.quantity + '/' + product.quantity : product.quantity}</span>
              <button
                aria-label={`Add one additional ${product.company} ${product.unit} to cart`}
                onClick={() => dispatch({ type: REDUCER_ACTIONS.ADD, payload: { ...product, quantity: 1 } })}
              >
                <svg xmlns='http://www.w3.org/2000/svg' width='1.1em' height='1.1em' viewBox='0 0 24 24'>
                  <path
                    fill='#ffffff'
                    d='m12.37 8.165l6.43 6.63c.401.414.158 1.205-.37 1.205H5.57c-.528 0-.771-.79-.37-1.205l6.43-6.63a.499.499 0 0 1 .74 0Z'
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </article>
      </li>
    );
  });
};

export default CartProducts;
