import type { TmdbMovieProvider, TmdbResponseFlat } from 'app/film-database/composables/types/TmdbResponse';
import { type JSX, memo } from 'react';

/**
 * Determine a movie's availability on streaming platforms or theatres
 * This includes early viewing options (rent or buy) on major platforms
 * NOTE: TMDB API does not list early streaming providers as streaming service (.flatrate property)
 * NOTE: TMDB API is not fully reliable, so we'll simplify "STREAMING" prompt as the primary handler of "EARLY VIEWING"
 */

// const earlyViewingProviders = ['Google Play Movies', 'Apple TV', 'Prime Video'];

const FDDetailsAvailability = memo(
  ({
    data,
    watchProviders,
  }: {
    data: TmdbMovieProvider;
    watchProviders: TmdbResponseFlat['watchProviders']['results']['US'] | undefined;
  }): JSX.Element | undefined => {
    if (!data || !data.release_date) return undefined;

    const releaseDate = data.release_date.replaceAll('-', ''); // YYYY/MM/DD ISO format converted to 8 digits
    const releaseDates = {
      year: parseInt(releaseDate.slice(0, 4), 10),
      month: parseInt(releaseDate.slice(4, 6), 10) - 1,
      day: parseInt(releaseDate.slice(6, 8), 10),
    };

    const release = new Date(releaseDates.year, releaseDates.month, releaseDates.day);
    const local = new Date();

    // NOTE: These variables are in priority order to ensure the correct status is prompted, handle them accordingly
    const isReleased = release < local;
    const isStreaming = watchProviders?.flatrate?.length;
    const isPurchasable = watchProviders?.buy?.length;
    const isRentable = watchProviders?.rent?.length;
    const isInTheatres = local > release;
    // const hasEarlyBuy = watchProviders.buy?.some((p) => earlyViewingProviders.includes(p.provider_name));
    // const hasEarlyRent = watchProviders.rent?.some((p) => earlyViewingProviders.includes(p.provider_name));
    // const hasEarlyViewing = hasEarlyBuy || hasEarlyRent;

    if (!isReleased) {
      return (
        <div data-status='gold'>
          {`Available ${release.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`}
        </div>
      );
    } else if (isStreaming) {
      return <div data-status='green'>Available to Stream</div>;
    } else if (isPurchasable && isRentable) {
      return <div data-status='green'>Available for Purchase or Rent</div>;
    } else if (isPurchasable) {
      return <div data-status='green'>Available for Purchase</div>;
    } else if (isRentable) {
      return <div data-status='green'>Rental Available</div>;
    } else if (isInTheatres) {
      return <div data-status='green'>Playing In Theatres</div>;
    } else {
      return <div data-status='red'>Whoops! Viewing Options Unavailable.</div>;
    }
  }
);

export default FDDetailsAvailability;
