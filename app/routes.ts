import { index, type RouteConfig, route } from '@react-router/dev/routes';
import { commerceData } from '../app/ecommerce/data/commerceData';

function buildCommercePaths() {
  const { companies, wearStyles, polarPatterns, categories } = commerceData;
  return [...companies, ...wearStyles, ...polarPatterns, ...categories];
}

const commercePaths = buildCommercePaths();

export default [
  index('./portfolio/routes/Portfolio.tsx'),

  route('ecommerce', './ecommerce/routes/Home.tsx'),
  route('ecommerce/products', './ecommerce/routes/ProductCatalog.tsx'),
  route('ecommerce/products/:paramId', './ecommerce/routes/ProductDetailPage.tsx'),
  ...commercePaths.map((path) => {
    return route(`ecommerce/products/${path}`, './ecommerce/routes/ProductCatalog.tsx', { id: `filter-${path}` });
  }),

  route('film-database', './film-database/routes/FilmDatabase.tsx'),

  // route('spotify-visualizer', './spotify-visualizer/routes/SpotifyVisualizer.tsx'),
] satisfies RouteConfig;
