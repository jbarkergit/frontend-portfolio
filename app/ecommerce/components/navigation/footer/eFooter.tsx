import { Link } from 'react-router';
import {
  Discover,
  Klarna,
  Mastercard,
  Paypal,
  Visa,
} from '../../../assets/production-images/user-account-svg/PaymentMethodSVGS';
import ENewsletter from './ENewsletter';
import SocialMedia from './SocialMedia';

const FooterSplitter = (sectionHeading: string) => {
  return (
    <div className='eFooter__splitter'>
      <span className='eFooter__splitter--line' />
      <span>{sectionHeading}</span>
      <span className='eFooter__splitter--line' />
    </div>
  );
};

const EFooter = () => {
  const support: string[] = [
    'My Account',
    'Dynamic Rewards',
    'Teacher Discount',
    'FAQ',
    'Shipping',
    'International',
    'Returns',
    'Find a Store',
  ];
  const services: string[] = [
    'Data Privacy',
    'Ethics',
    'EULA',
    'General Conditions',
    'Payment Processing',
    'Terms and Conditions',
  ];

  return (
    <footer className='eFooter'>
      <section className='eFooter__newsletter'>
        {FooterSplitter('News & discounts')}
        <ENewsletter />
      </section>

      <section className='eFooter__customerSupport'>
        {FooterSplitter('Customer Support')}
        <nav className='eFooter__customer__policies'>
          <section className='eFooter__customer__policies__support'>
            <ul>
              {support.map((listItem: string) => (
                <li key={listItem}>
                  <Link to={`/${listItem}`}>{listItem}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section className='eFooter__customer__policies__support'>
            <ul>
              {services.map((listItem: string) => (
                <li key={listItem}>
                  <Link to={`/${listItem}`}>{listItem}</Link>
                </li>
              ))}
            </ul>
          </section>
        </nav>
      </section>

      <section className='eFooter__additions'>
        <section className='eFooter__additions__paymentTypes'>
          <Klarna />
          <Mastercard />
          <Visa />
          <Discover />
          <Paypal />
        </section>
        <section className='eFooter__additions__address'>
          <small>2023 Dynamic Audio</small>
          <address>1800 DAUDIO</address>
          <address>support@dynamicaudio.com</address>
        </section>
        <section className='eFooter__additions__socialMedia'>
          <SocialMedia />
        </section>
      </section>
    </footer>
  );
};

export default EFooter;
