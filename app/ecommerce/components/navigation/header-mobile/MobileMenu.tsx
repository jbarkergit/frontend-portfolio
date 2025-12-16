import type { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router';
import EcoNavigationLinks from '../navigation-links/EcoNavigationLinks';

type MobileMenuType = {
  setUnmount: Dispatch<SetStateAction<boolean>>;
};

const MobileMenu = ({ setUnmount }: MobileMenuType) => {
  return (
    <aside className='ecoModalCart'>
      <div className='ecoModal__simpleHeading'>
        <Link to='/ecommerce'>Dynamic Audio</Link>
      </div>
      <nav className='ecoModal__nav'>
        <ul className='ecoModal__nav__ul'>
          <EcoNavigationLinks />
          <li className='ecoModal__nav__ul__li'>
            <button aria-label='Close menu' onClick={() => setUnmount(true)}>
              <svg xmlns='http://www.w3.org/2000/svg' width='1.6em' height='1.6em' viewBox='0 0 24 24'>
                <path
                  fill='#ffffff'
                  d='M9 19q-.5 0-.938-.225t-.712-.625l-3.525-5Q3.45 12.625 3.45 12t.375-1.15l3.525-5q.275-.4.713-.625T9 5h10q.825 0 1.413.588T21 7v10q0 .825-.588 1.413T19 19H9Zm5-5.6l1.9 1.9q.275.275.7.275t.7-.275q.275-.275.275-.7t-.275-.7L15.4 12l1.9-1.9q.275-.275.275-.7t-.275-.7q-.275-.275-.7-.275t-.7.275L14 10.6l-1.9-1.9q-.275-.275-.7-.275t-.7.275q-.275.275-.275.7t.275.7l1.9 1.9l-1.9 1.9q-.275.275-.275.7t.275.7q.275.275.7.275t.7-.275l1.9-1.9Z'
                ></path>
              </svg>
              Return
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default MobileMenu;
