import { Link } from 'react-router';
import video1 from '/app/ecommerce/assets/production-videos/stock-footage-splice-688x860.webm';

const SideBySide = () => {
  return (
    <section>
      <article className='sideBySide'>
        <div className='sideBySide__textArea'>
          <h2>
            <span>Groundbreaking Tech,</span>
            <span>
              <span className='highlight'>superior</span> audio
            </span>
          </h2>
          <p>
            Our mission at Dynamic Audio is to offer a diverse selection of superior HiFi audio products from renowned
            brands, to ensure top-notch sound quality for all. Our curated collection features high-fidelity headphones
            crafted by industry-leading manufacturers known for their commitment to excellence. With every purchase,
            enjoy instant satisfaction knowing you're backed by the expertise and craftsmanship of the brands we
            represent.
          </p>
          <Link
            to='/ecommerce/products'
            aria-label='Browse Products Now'
            onClick={() => scrollTo({ top: 0 })}>
            Browse Products Now
          </Link>
        </div>
        <aside className='sideBySide__video'>
          <video
            preload='none'
            playsInline
            autoPlay
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
      </article>
    </section>
  );
};

export default SideBySide;
