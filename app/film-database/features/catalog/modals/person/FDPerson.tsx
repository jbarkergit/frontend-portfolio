import { SvgSpinnersRingResize, MaterialSymbolsLogoutSharp } from 'app/film-database/assets/svg/icons';
import { tmdbCall } from 'app/film-database/composables/tmdbCall';
import type { TmdbResponseFlat } from 'app/film-database/composables/types/TmdbResponse';
import { useModalContext } from 'app/film-database/context/ModalContext';
import { useModalTrailerContext } from 'app/film-database/context/ModalTrailerContext';
import { usePersonContext } from 'app/film-database/context/PersonContext';
import { useState, useRef, useEffect, useMemo } from 'react';

type Cast = TmdbResponseFlat['personCredits']['cast'][number];

const FDPerson = () => {
  const { person } = usePersonContext();
  const { setModalTrailer } = useModalTrailerContext();
  const { setModal } = useModalContext();

  const [response, setResponse] = useState<{
    details: TmdbResponseFlat['personDetails'] | undefined;
    credits: TmdbResponseFlat['personCredits'] | undefined;
  }>({ details: undefined, credits: undefined });

  const { details, credits } = response;

  const clampRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPerson = async () => {
      if (!person) return;

      const responses = await tmdbCall(controller, [{ personDetails: person }, { personCredits: person }]);

      const details = responses.find(
        (r): r is { key: 'personDetails'; response: TmdbResponseFlat['personDetails'] } => r.key === 'personDetails'
      )?.response;

      const credits = responses.find(
        (r): r is { key: 'personCredits'; response: TmdbResponseFlat['personCredits'] } => r.key === 'personCredits'
      )?.response;

      setResponse({ details, credits });
    };

    fetchPerson();

    return () => controller.abort();
  }, [person]);

  // Dep
  const allCast = useMemo(() => {
    if (!credits) return [];
    const allCast: Cast[] = Array.isArray(credits.cast[0]) ? credits.cast.flat(1) : credits.cast;
    return allCast;
  }, [credits]);

  // Known for
  // const knownFor = useMemo(() => {
  //   return allCast
  //     .flat()
  //     .sort((a, b) => b.vote_average - a.vote_average)
  //     .slice(0, chunkSize.modal * 2);
  // }, [credits]);

  // Group cast credits by year
  const castCreditsGrouped = useMemo(() => {
    const filteredCast = allCast.filter((film) => film.media_type !== 'tv' && film.release_date);

    const grouped: Record<string, Cast[]> = {};
    for (const film of filteredCast) {
      const year = new Date(film.release_date!).getFullYear().toString();
      (grouped[year] ||= []).push(film);
    }

    return Object.keys(grouped)
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({ year, films: grouped[year] }));
  }, [credits]);

  // Clamp handler
  // const handleClamp = () => {
  //   if (!clampRef.current) return;

  //   const isClamped = clampRef.current.getAttribute('data-clamp') === 'true';

  //   if (isClamped) {
  //     clampRef.current.style.maxHeight = `${clampRef.current.scrollHeight}px`;
  //     clampRef.current.setAttribute('data-clamp', 'false');
  //   } else {
  //     const lineHeight = parseFloat(getComputedStyle(clampRef.current).lineHeight || '20');
  //     clampRef.current.style.maxHeight = `${lineHeight * 4}px`;
  //     clampRef.current.setAttribute('data-clamp', 'true');
  //   }
  // };

  // JSX
  if (!details || !credits)
    return (
      <div className='fdPerson'>
        <div className='fdPerson__loader'>
          <SvgSpinnersRingResize />
        </div>
      </div>
    );
  return (
    <article className='fdPerson'>
      <button
        className='fdPerson--exit'
        aria-label='Close View More Modal'
        onClick={() => setModal('movie')}>
        <MaterialSymbolsLogoutSharp />
      </button>

      <div className='fdPerson__column'>
        <picture data-missing={details.profile_path ? 'false' : 'true'}>
          {details.profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w342/${details.profile_path}`}
              alt={details.name}
              fetchPriority='high'
            />
          ) : (
            <img
              src='https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-4-user-grey-d8fe957375e70239d6abdd549fd7568c89281b2179b5f4470e2e12895792dfa5.svg'
              alt={details.name}
              loading='lazy'
            />
          )}
        </picture>
        <ul>
          <li>
            <h2>{details.name}</h2>
          </li>
          <li>
            <span>Known For</span>
            <span>{details.known_for_department}</span>
          </li>
          <li>
            <span>Known Credits</span>
            <span>{credits.cast.length + credits.crew.length}</span>
          </li>
          <li>
            <span>Gender</span>
            <span>{details.gender === 2 ? 'Male' : 'Female'}</span>
          </li>
          <li>
            <span>Birthday</span>
            <span>{details.birthday}</span>
          </li>
          {details.deathday && (
            <li>
              <span>Death Day</span>
              <span>{details.deathday}</span>
            </li>
          )}
          <li>
            <span>Place of Birth</span>
            <span>{details.place_of_birth}</span>
          </li>
          <li>
            <span>Also Known As</span>
            {details.also_known_as.map((name, index) => (
              <span key={index}>
                {name}
                {index < details.also_known_as.length - 1 ? ', ' : ''}
              </span>
            ))}
          </li>
        </ul>
      </div>

      <div className='fdPerson__column'>
        {details.biography && details.biography.length > 0 && (
          <div className='fdPerson__column__bio'>
            <span>Biography</span>
            <span
              ref={clampRef}
              data-clamp='true'>
              {details.biography}
            </span>
          </div>
        )}

        {/* {knownFor.length > 0 && (
          <GenericCarousel
            carouselIndex={1}
            carouselName='person'
            heading='Known For'
            data={knownFor}
          />
        )} */}

        {castCreditsGrouped.length > 0 && (
          <table className='fdPerson__column__table'>
            <thead>
              <tr>
                <th>Filmography</th>
              </tr>
            </thead>
            <tbody className='fdPerson__column__table__tbody'>
              {castCreditsGrouped.map((group, index) => (
                <tr
                  className='fdPerson__column__table__tbody__tr'
                  key={`person-casted-group-${index}`}>
                  <td className='fdPerson__column__table__tbody__tr__td'>
                    <table className='fdPerson__column__table__tbody__tr__td__table'>
                      <tbody className='fdPerson__column__table__tbody__tr__td__table__tbody'>
                        {group.films?.map((film) => (
                          <tr
                            className='fdPerson__column__table__tbody__tr__td__table__tbody__tr'
                            key={`person-casted-group-${index}-movieId-${film.id}`}>
                            <td className='fdPerson__column__table__tbody__tr__td__table__tbody__tr__td'>
                              {group.year}
                            </td>
                            <td className='fdPerson__column__table__tbody__tr__td__table__tbody__tr__td'>
                              <button
                                aria-label={`View ${film.title}`}
                                onClick={() => {
                                  setModalTrailer(film);
                                  setModal('movie');
                                }}>
                                {film.title}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </article>
  );
};

export default FDPerson;
