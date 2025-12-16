import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import MobileMenu from '../components/navigation/header-mobile/MobileMenu';
import ShoppingCart from './shopping-cart/ShoppingCart';
import UserAccountActive from './user-account/UserAccountActive';
import UserAccountRegistry from './user-account/UserAccountRegistry';
import UserLoginModal from './user-account/UserLoginModal';

type ModalFeatureType = {
  uiModal: string;
  setUiModal: Dispatch<SetStateAction<string>>;
};

const ModalFeatures = ({ uiModal, setUiModal }: ModalFeatureType) => {
  /** useRef */
  const modalWrapper = useRef<HTMLElement>(null);
  const ecoModal = useRef<HTMLDivElement>(null);

  /** Animation unmount state */
  const [unmount, setUnmount] = useState<boolean>(false);

  /** All modals, conditionally rendered for LCP */
  const conditionallyRenderedModals = () => {
    switch (uiModal) {
      case 'shoppingCart':
        return <ShoppingCart setUnmount={setUnmount} />;
      case 'mobileMenu':
        return <MobileMenu setUnmount={setUnmount} />;
      case 'userLogin':
        return <UserLoginModal setUiModal={setUiModal} setUnmount={setUnmount} />;
      case 'userRegistry':
        return <UserAccountRegistry setUiModal={setUiModal} />;
      case 'userActive':
        if (JSON.parse(localStorage.getItem('emailAddress')!)) return <UserAccountActive setUiModal={setUiModal} />;
      default:
        null;
        break;
    }
  };

  /** Form Exterior Click Handler */
  useEffect(() => {
    const handleExteriorClick = (e: PointerEvent) => {
      if (
        uiModal !== '' &&
        ecoModal.current &&
        ecoModal.current.getAttribute('data-status') === 'active' &&
        !ecoModal.current?.contains(e.target as Node)
      ) {
        setUnmount(true);
      }
    };

    document.body.addEventListener('pointerup', handleExteriorClick);
    return () => document.body.removeEventListener('pointerup', handleExteriorClick);
  }, [uiModal]);

  //** Animation mount animation handler */
  useEffect(() => {
    if (uiModal !== '' && unmount === false) {
      setTimeout(() => {
        if (modalWrapper.current && ecoModal.current) {
          modalWrapper.current.setAttribute('data-status', 'active');
          ecoModal.current.setAttribute('data-status', 'active');
        }
      }, 50);
    }
  }, [uiModal]);

  /** Delay unmount animation handler */
  useEffect(() => {
    if (unmount === true && modalWrapper.current && ecoModal.current) {
      modalWrapper.current.setAttribute('data-status', 'disabled');
      ecoModal.current.setAttribute('data-status', 'disabled');
    }
  }, [unmount]);

  /** Component */
  if (uiModal !== '') {
    return (
      <section
        className='modalWrapper'
        ref={modalWrapper}
        onTransitionEnd={() => {
          if (modalWrapper.current?.getAttribute('data-status') === 'disabled') {
            setUnmount(false);
            setUiModal('');
          }
        }}
      >
        <div
          className='ecoModal'
          ref={ecoModal}
          style={uiModal === 'shoppingCart' ? { display: 'block' } : {}}
          onTransitionEnd={() => {
            if (ecoModal.current?.getAttribute('data-status') === 'disabled') {
              setUnmount(false);
              setUiModal('');
            }
          }}
        >
          {conditionallyRenderedModals()}
        </div>
      </section>
    );
  } else {
    null;
  }
};
export default ModalFeatures;
