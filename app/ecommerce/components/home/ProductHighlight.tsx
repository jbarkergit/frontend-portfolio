import type { ProductType } from 'app/ecommerce/context/CartContext';
import { commerceDatabase } from 'app/ecommerce/data/commerceDatabase';
import { Link } from 'react-router';
import video1 from '/app/ecommerce/assets/production-videos/stock-footage-splice-374x467.webm';

const ProductHighlight = () => {
  //Play video on user pointer hover
  const playPauseVideo = (e: React.PointerEvent<HTMLElement>, play: boolean): void => {
    const videoTarget = (e.currentTarget as HTMLPictureElement).parentNode?.children[1]
      ?.children[0] as HTMLVideoElement;

    if (play) {
      videoTarget.play();
    } else {
      videoTarget.pause();
      videoTarget.currentTime = 0;
    }
  };

  return (
    <section className='productHighlight'>
      <h2 className='productHighlight__heading'>
        <span>
          Available <span className='highlight'>Now</span>
        </span>
      </h2>
      <ul>
        {commerceDatabase
          .filter((product: ProductType) => product.productshowcase === true)
          .map((product: ProductType) => (
            <li key={`product-highlight-${product.sku}`}>
              <Link
                to={`/ecommerce/products/${product.sku}`}
                tabIndex={0}>
                <article>
                  <picture
                    onPointerOver={(e: React.PointerEvent<HTMLPictureElement>) => playPauseVideo(e, true)}
                    onPointerLeave={(e: React.PointerEvent<HTMLPictureElement>) => playPauseVideo(e, false)}>
                    <img
                      src={product.images!.medium[0]}
                      alt={`${product.company} ${product.unit}`}
                      loading='lazy'
                      decoding='async'
                      fetchPriority='low'
                    />
                  </picture>
                  <aside>
                    <video
                      preload='none'
                      playsInline
                      loop
                      muted
                      aria-label='Video of joyful people wearing headphones listening to music'
                      tabIndex={-1}>
                      <source
                        src={video1}
                        type='video/webm'
                      />
                    </video>
                  </aside>
                  <hgroup className='productHighlightInfo'>
                    <h2>
                      {product.company} {product.unit}
                    </h2>
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
    </section>
  );
};

export default ProductHighlight;
