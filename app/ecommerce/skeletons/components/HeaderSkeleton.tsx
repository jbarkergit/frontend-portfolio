import { useLocation } from 'react-router';

const HeaderSkeleton = () => {
  return (
    <div
      className='skeleton__header'
      style={
        useLocation().pathname === 'ProductCatalogSkeleton'
          ? { borderBottom: '4px solid hsl(0, 0%, 20%)' }
          : { borderBottom: '0px solid black' }
      }
    >
      <div className='skeleton__header__desktop'>
        <div className='skeleton--gridColumn --flexStart'>
          <div className='skeleton--logo' />
        </div>
        <div className='skeleton--gridColumn --flexCenter'>
          <div className='skeleton--link' />
          <div className='skeleton--link' />
          <div className='skeleton--link' />
          <div className='skeleton--link' />
          <div className='skeleton--link' />
        </div>
        <div className='skeleton--gridColumn --flexEnd'>
          <div className='skeleton--button' />
          <div className='skeleton--button' />
          <div className='skeleton--button' />
        </div>
      </div>
      <div className='skeleton__header__mobile'>
        <div className='skeleton--logo' />
        <div className='skeleton__header__mobile--svg --flexEnd'>
          <svg xmlns='http://www.w3.org/2000/svg' width='2em' height='2em' viewBox='0 0 256 256'>
            <path
              fill='hsl(0, 0%, 55%)'
              d='M222 128a6 6 0 0 1-6 6H40a6 6 0 0 1 0-12h176a6 6 0 0 1 6 6ZM40 70h176a6 6 0 0 0 0-12H40a6 6 0 0 0 0 12Zm176 116H40a6 6 0 0 0 0 12h176a6 6 0 0 0 0-12Z'
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};
export default HeaderSkeleton;
