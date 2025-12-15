import { commerceData } from 'app/ecommerce/data/commerceData';
import { Link } from 'react-router';

const EcoNavigationLinks = () => {
  const categories: string[] = commerceData.categories;

  return (
    <>
      <li>
        <Link to='/ecommerce/products'>All Products</Link>
      </li>
      {categories.map((category) => (
        <li key={category}>
          <Link to={`/ecommerce/products/${category}`}>{category === 'amps-dacs' ? 'Amps & Dacs' : category}</Link>
        </li>
      ))}
    </>
  );
};

export default EcoNavigationLinks;
