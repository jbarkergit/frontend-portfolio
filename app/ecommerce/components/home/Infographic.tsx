import type { JSX } from 'react';
import { Link } from 'react-router';
import infographic1 from '/app/ecommerce/assets/production-images/compressed-home-page/infographic/infographic-1.jpg?url';
import infographic2 from '/app/ecommerce/assets/production-images/compressed-home-page/infographic/infographic-2.jpg?url';
import infographic3 from '/app/ecommerce/assets/production-images/compressed-home-page/infographic/infographic-3.jpg?url';

const Graphic = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <section className='infographic__graphic'>
      <picture>
        <img src={src} alt={alt} decoding='async' fetchPriority='high' tabIndex={0} />
      </picture>
    </section>
  );
};

const Infographic = (): JSX.Element => {
  return (
    <main className='infographic'>
      <section className='infographic__article'>
        <strong tabIndex={0}>
          <span>THE NEW </span>
          <span>HiFi AUDIO </span>
          <span className='highlight'>EXPERIENCE</span>
        </strong>
        <h1 className='infographic__article__heading' tabIndex={0}>
          Unparalleled HiFi audio and <span className='highlight'>superior</span> manufacturing for discerning
          audiophiles. Crystal-clear sound, <span className='highlight'>premium </span>
          materials, meticulous <span className='highlight'>craftsmanship</span>, and lasting durability.
        </h1>
      </section>
      <Graphic src={infographic1} alt={'Model wearing Marshal headphones'} />
      <Graphic src={infographic2} alt={'Man listening to notes he is playing'} />
      <article className='infographic__article'>
        <h2 tabIndex={0}>
          <span>NEW TECH FROM </span>
          <span className='highlight'>Beyerdynamic</span>
        </h2>
        <p tabIndex={0}>
          Thanks to our friends over at Beyerdynamic, we're proud to introduce a new line of headphones sporting all new
          Tesla technology.
        </p>
        <Link
          to='http://localhost:5173/ecommerce/products/Beyerdynamic'
          className='infographic__section__news__textBlock--cta'
          aria-label='Shop Tesla enhanced Headphones'
        >
          Shop Tesla enhanced Headphones
        </Link>
      </article>
      <Graphic src={infographic3} alt={'Model singing into Shure SM58'} />
    </main>
  );
};

export default Infographic;
