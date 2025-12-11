import { commerceDatabase } from '~/ecommerce/data/commerceDatabase';
import type { ProductType } from '../context/CartContext';

/** Helper */
const sort = (data: Set<string>) => [...data].sort((a, b) => (a > b ? 1 : -1));

/** Internal builder */
function buildCommerceData() {
  const sets = commerceDatabase.reduce(
    (
      result: {
        company: Set<string>;
        polarPattern: Set<string>;
        wearStyle: Set<string>;
        headphoneCompanies: Set<string>;
        microphoneCompanies: Set<string>;
        categories: Set<string>;
      },
      product: ProductType
    ) => {
      // Companies
      if (product.company) result.company.add(product.company);

      // Polar patterns
      if (Array.isArray(product.polarPattern)) {
        for (const pattern of product.polarPattern) {
          if (pattern) result.polarPattern.add(pattern);
        }
      } else if (product.polarPattern) {
        result.polarPattern.add(product.polarPattern);
      }

      // Wear styles
      if (product.wearStyle) result.wearStyle.add(product.wearStyle);

      // Headphones
      if (product.category === 'headphones') {
        result.headphoneCompanies.add(product.company);
      }

      // Microphones
      if (product.category === 'microphones') {
        result.microphoneCompanies.add(product.company);
      }

      // Unique category
      if (product.category) {
        result.categories.add(product.category);
      }

      return result;
    },
    {
      company: new Set<string>(),
      polarPattern: new Set<string>(),
      wearStyle: new Set<string>(),
      headphoneCompanies: new Set<string>(),
      microphoneCompanies: new Set<string>(),
      categories: new Set<string>(),
    }
  );

  /**
   * Convert sets to arrays, sort in descending order
   */
  return {
    companies: sort(sets.company),
    polarPatterns: sort(sets.polarPattern),
    wearStyles: sort(sets.wearStyle),
    headphoneCompanies: sort(sets.headphoneCompanies),
    microphoneCompanies: sort(sets.microphoneCompanies),
    categories: sort(sets.categories),
  };
}

export const commerceData = buildCommerceData();
