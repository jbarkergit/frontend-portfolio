import { FullStar, HalfStar, EmptyStar } from 'app/film-database/assets/svg/icons';
import type { TmdbMovieProvider } from 'app/film-database/composables/types/TmdbResponse';
import { type JSX } from 'react';

/** Get visual representation of vote average as stars */
const VoteAverageVisual = ({ data }: { data: TmdbMovieProvider }): JSX.Element | undefined => {
  const voteAvg = data.vote_average;

  // 0-10 vote scale (contains floating point value) floored and converted to 0-5 vote scale
  const flooredVoteAverage: number = Math.floor(voteAvg / 2);

  // Helpers
  const hasFloatingValue: boolean = voteAvg % 2 >= 1;
  const maxStars: number = 5;

  const fullStars: number = flooredVoteAverage;
  const halfStars: 1 | 0 = hasFloatingValue ? 1 : 0;
  const emptyStars: number = maxStars - fullStars - halfStars;

  const stars: JSX.Element[] = [
    ...Array(fullStars).fill(<FullStar />),
    ...Array(halfStars).fill(<HalfStar />),
    ...Array(emptyStars).fill(<EmptyStar />),
  ];

  return (
    <div
      className='fdDetails__extra__inf__voteAvgVisual'
      aria-label={`Vote Average ${voteAvg / 2} out of 5`}>
      {stars.map((Star, index) => (
        <span key={`star-${index}`}>{Star}</span>
      ))}
    </div>
  );
};

export default VoteAverageVisual;
