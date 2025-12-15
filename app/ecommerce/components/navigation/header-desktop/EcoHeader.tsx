import { useState } from 'react';
import { Link } from 'react-router';
import EcoNavigationLinks from '../navigation-links/EcoNavigationLinks';
import ModalFeatures from '../../../features/ModalFeatures';
import SearchBar from '../../../features/search-bar/SearchBar';
import { useCart } from 'app/ecommerce/context/CartContext';

const EcoHeader = () => {
  const { cartProductQuantity } = useCart();

  const [uiModal, setUiModal] = useState<string>('');

  const checkLoginState = (): void =>
    localStorage.getItem('userSignedIn') === 'true'
      ? setUiModal('userActive')
      : setUiModal(uiModal === 'userLogin' ? '' : 'userLogin');

  return (
    <>
      <header className='navkit'>
        <section className='navkit__section'>
          <Link to='/ecommerce'>Dynamic Audio</Link>
        </section>
        <section className='navkit__section'>
          <nav className='navkit__section'>
            <ul className='navkit__section__links'>
              <EcoNavigationLinks />
            </ul>
          </nav>
        </section>
        <section className='navkit__section'>
          <SearchBar />
          <button
            className='ctaBtn'
            aria-label='Account'
            id='myAccountBtn'
            onClick={checkLoginState}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='1.5em'
              height='1.5em'
              viewBox='0 0 24 24'>
              <path
                fill='#333333'
                d='M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-6 8q-.825 0-1.413-.588T4 18v-.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.588 1.413T18 20H6Z'></path>
            </svg>
            <span className='text'>Account</span>
          </button>
          <button
            className='ctaBtn'
            aria-label='Shopping Cart'
            onClick={() => setUiModal(uiModal === 'shoppingCart' ? '' : 'shoppingCart')}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='1.6em'
              height='1.6em'
              viewBox='0 0 24 24'>
              <path
                fill='hsl(0, 0%, 100%)'
                d='M2.237 2.288a.75.75 0 1 0-.474 1.423l.265.089c.676.225 1.124.376 1.453.529c.312.145.447.262.533.382c.087.12.155.284.194.626c.041.361.042.833.042 1.546v2.672c0 1.367 0 2.47.117 3.337c.12.9.38 1.658.982 2.26c.601.602 1.36.86 2.26.981c.866.117 1.969.117 3.336.117H18a.75.75 0 0 0 0-1.5h-7c-1.435 0-2.436-.002-3.192-.103c-.733-.099-1.122-.28-1.399-.556c-.235-.235-.4-.551-.506-1.091h10.12c.959 0 1.438 0 1.814-.248c.376-.248.565-.688.943-1.57l.428-1c.81-1.89 1.215-2.834.77-3.508C19.533 6 18.506 6 16.45 6H5.745a8.996 8.996 0 0 0-.047-.833c-.055-.485-.176-.93-.467-1.333c-.291-.404-.675-.66-1.117-.865c-.417-.194-.946-.37-1.572-.58l-.305-.1ZM7.5 18a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Zm9 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3Z'></path>
            </svg>
            <span className='text'>Shopping Cart {cartProductQuantity}</span>
          </button>
          <button
            aria-label='Navigation Menu'
            className='navkit__section__mobileMenuBtn'
            onClick={() => setUiModal(uiModal === 'mobileMenu' ? '' : 'mobileMenu')}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='1.5em'
              height='1.5em'
              viewBox='0 0 24 24'>
              <path
                fill='hsl(0, 0%, 100%)'
                d='M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z'></path>
            </svg>
          </button>
        </section>
      </header>
      <ModalFeatures
        uiModal={uiModal}
        setUiModal={setUiModal}
      />
    </>
  );
};

export default EcoHeader;
