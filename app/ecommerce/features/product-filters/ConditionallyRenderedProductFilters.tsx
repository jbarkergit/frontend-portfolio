import { commerceData } from 'app/ecommerce/data/commerceData';
import { useLocation } from 'react-router';
import ProductFilterConstructor from './ProductFilterConstructor';

const ConditionallyRenderedProductFilters = () => {
  // Memoized data dependencies
  const uniqueWearStyles: string[] = commerceData.wearStyles;
  const uniquePolarPatterns: string[] = commerceData.polarPatterns;

  // Filter Components built with ProductFilterConstructor: takes initial filter name and custom hook that returns data
  const WearStyleFilter = () => ProductFilterConstructor('Filter by Wear Style', uniqueWearStyles);
  const PolarPatternFilter = () => ProductFilterConstructor('Filter by Polar Pattern', uniquePolarPatterns);

  // Memoized conditional data dependencies for conditional rendering
  const uniqueHeadphoneCompanies: string[] = commerceData.headphoneCompanies;
  const uniqueMicrophoneCompanies: string[] = commerceData.microphoneCompanies;

  // Variable dependencies for conditional rendering
  const regexPattern: RegExp = /\/ecommerce\//g;
  const location: string = useLocation().pathname.replace(regexPattern, '');

  // Conditional rendering
  if (location === 'products') {
    return (
      <>
        <WearStyleFilter />
        <PolarPatternFilter />
      </>
    );
  } else if (['headphones', ...uniqueHeadphoneCompanies, ...uniqueWearStyles].includes(location)) {
    return <WearStyleFilter />;
  } else if (['microphones', ...uniqueMicrophoneCompanies, ...uniquePolarPatterns].includes(location)) {
    return <PolarPatternFilter />;
  } else {
    return (
      <>
        <WearStyleFilter />
        <PolarPatternFilter />
      </>
    );
  }
};

export default ConditionallyRenderedProductFilters;
