import { commerceDatabase } from 'app/ecommerce/data/commerceDatabase';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import type { ProductType } from '../../../context/CartContext';

type MoreLikeThisType = {
  findProduct: ProductType;
};

const MoreLikeThis = ({ findProduct }: MoreLikeThisType) => {
  const filteredRecommenders = commerceDatabase.filter(
    (product) => product.sku !== findProduct.sku && product.category === findProduct.category
  );

  //Force page refresh upon component change
  const { paramId } = useParams() as { paramId: string };

  useEffect(() => window.scrollTo({ top: 0 }), [paramId]);

  return (
    <aside className='recommenders'>
      <h2 className='recommenders__header'>
        {findProduct.category !== 'amps-dacs' ? (
          <>
            More {findProduct.category} like <span className='highlight'>{findProduct.unit}</span>
          </>
        ) : (
          <>
            More Amps & Dacs like <span className='highlight'>{findProduct.unit}</span>
          </>
        )}
      </h2>
      <ul className='recommenders__unorderedList'>
        {filteredRecommenders.splice(0, 8).map((product) => (
          <li key={`more-like-this-${product.sku}`} className='recommenders__unorderedList__item'>
            <Link to={`/ecommerce/products/${product.sku}`}>
              <article>
                <picture>
                  <img
                    src={product.images?.small[0]}
                    alt={`${product.company} ${product.unit}`}
                    loading='lazy'
                    decoding='async'
                    fetchPriority='low'
                  />
                </picture>
                <hgroup>
                  <h2>{product.unit}</h2>
                  <h3>
                    Starting at{' '}
                    {Intl.NumberFormat('en-us', { currency: 'USD', style: 'currency' }).format(product.price)}
                  </h3>
                </hgroup>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};
export default MoreLikeThis;
