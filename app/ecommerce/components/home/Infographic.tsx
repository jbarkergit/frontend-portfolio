import type { JSX } from 'react';
import { Link } from 'react-router';

import infographic1 from '/app/ecommerce/assets/production-images/compressed-home-page/infographic/infographic-1.jpg?url';
import infographic2 from '/app/ecommerce/assets/production-images/compressed-home-page/infographic/infographic-2.jpg?url';
import infographic3 from '/app/ecommerce/assets/production-images/compressed-home-page/infographic/infographic-3.jpg?url';

const InfographicSectionOne = () => {
  return (
    <article className='infographic__primary'>
      <section className='infographic__primary__article'>
        <strong className='infographic__primary__article__strong' tabIndex={0}>
          <span className='infographic__primary__article__strong--line'>THE NEW </span>
          <span className='infographic__primary__article__strong--line'>HiFi AUDIO </span>
          <span className='infographic__primary__article__strong--line highlight'>EXPERIENCE</span>
        </strong>
        <h1 className='infographic__primary__article__heading' tabIndex={0}>
          Unparalleled HiFi audio and <span className='highlight'>superior</span> manufacturing for discerning
          audiophiles. Crystal-clear sound, <span className='highlight'>premium </span>
          materials, meticulous <span className='highlight'>craftsmanship</span>, and lasting durability.
        </h1>
      </section>

      <figure className='infographic__primary__graphic'>
        <picture>
          <img
            tabIndex={0}
            src={infographic1}
            alt='Model wearing Marshal headphones'
            decoding='async'
            fetchPriority='high'
          />
          <figcaption>Model wearing Marshal headphones</figcaption>
        </picture>
      </figure>
    </article>
  );
};

const InfographicSectionTwo = () => {
  return (
    <figure className='infographic__supporting'>
      <picture>
        <img
          src={infographic2}
          alt='Man listening to notes he is playing'
          decoding='async'
          fetchPriority='high'
          tabIndex={0}
        />
        <figcaption>Model wearing DT 990 Black Special Edition</figcaption>
      </picture>
    </figure>
  );
};

const InfographicSectionThree = () => {
  return (
    <article className='infographic__cta'>
      <section className='infographic__cta__article'>
        <h2 className='infographic__cta__article--heading' tabIndex={0}>
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
      </section>

      <figure className='infographic__cta__graphic'>
        <picture>
          <img
            src={infographic3}
            alt='Model singing into Shure SM58'
            decoding='async'
            fetchPriority='high'
            tabIndex={0}
          />
          <figcaption>Model singing into Shure SM58</figcaption>
        </picture>
      </figure>
    </article>
  );
};

const Infographic = (): JSX.Element => {
  return (
    <main className='infographic'>
      <InfographicSectionOne />
      <InfographicSectionTwo />
      <InfographicSectionThree />
    </main>
  );
};

export default Infographic;
