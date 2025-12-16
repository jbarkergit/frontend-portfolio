// Context

import Carousel from '../components/home/Carousel';
import Infographic from '../components/home/Infographic';
import ProductHighlight from '../components/home/ProductHighlight';
import SideBySide from '../components/home/SideBySide';
import EFooter from '../components/navigation/footer/eFooter';
// Components
import Header from '../components/navigation/header-desktop/EcoHeader';
import { CartProvider } from '../context/CartContext';

const EcommerceHome = () => {
  return (
    <CartProvider>
      <div id='ecommerce'>
        <Header />
        <Infographic />
        <Carousel />
        <SideBySide />
        <ProductHighlight />
        <EFooter />
      </div>
    </CartProvider>
  );
};

export default EcommerceHome;
