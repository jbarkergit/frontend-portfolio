import FDDetailsAvailability from 'app/film-database/components/details/FDDetailsAvailability';
import FDDetailsCollectionDropdown from 'app/film-database/components/details/FDDetailsCollectionDropdown';
import VoteAverageVisual from 'app/film-database/components/details/FDDetailsVoteAverageVisual';
import { tmdbDiscoveryIds } from 'app/film-database/composables/const/tmdbDiscoveryIds';
import { tmdbCall } from 'app/film-database/composables/tmdbCall';
import type { TmdbResponseFlat } from 'app/film-database/composables/types/TmdbResponse';
import { useHeroDataContext } from 'app/film-database/context/HeroDataContext';
import { useModalContext } from 'app/film-database/context/ModalContext';
import { useModalDataContext } from 'app/film-database/context/ModalDataContext';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import JustWatch from '/app/film-database/assets/api/JustWatch-logo-large.webp?url';
import { MaterialSymbolsLogoutSharp, TheMovieDatabaseLogo } from '../../assets/svg/icons';

const discoveryIdMap = Object.fromEntries(Object.entries(tmdbDiscoveryIds).map(([k, v]) => [v, k]));

const FDDetails = ({ modal }: { modal: boolean }) => {
  const { setModal } = useModalContext();

  const { heroData } = useHeroDataContext();
  const { modalData, setModalData } = useModalDataContext();

  const data = !modal ? heroData : modalData;
  if (!data) return;

  const [watchProviders, setWatchProviders] = useState<TmdbResponseFlat['watchProviders']['results']['US'] | undefined>(
    undefined
  );

  const genreIds = useMemo(
    () => data.genre_ids.map((id: string | number) => discoveryIdMap[id]?.replaceAll('_', ' ')),
    [data]
  );

  /** Fetch watch providers when data changes */
  useEffect(() => {
    if (!modal) return;

    const controller = new AbortController();

    const fetchWatchProviders = async () => {
      const res = await tmdbCall(controller, { watchProviders: data.id });
      setWatchProviders(res.response.results.US);
    };

    fetchWatchProviders();

    return () => controller.abort();
  }, [data, modal]);

  /**
   * Reduce provider categories by combining providers that offer 'buy' and 'rent' options
   * Then handle providers that offer only 'buy' or 'rent'
   */
  const providers = useMemo(() => {
    if (!watchProviders || !watchProviders.buy || !watchProviders.rent) return undefined;

    const combined = Array.from(
      new Map([...watchProviders.buy, ...watchProviders.rent].map((entry) => [entry.provider_id, entry])).values()
    );
    const combinedIds = new Set(combined.map((entry) => entry.provider_id));
    const purchasable = watchProviders.buy.filter((entry) => !combinedIds.has(entry.provider_id));
    const rentable = watchProviders.rent.filter((entry) => !combinedIds.has(entry.provider_id));

    return { combined, purchasable, rentable };
  }, [watchProviders]);

  /** @returns */
  return (
    <article className='fdDetails' data-modal={modal}>
      {modal && (
        <button className='fdDetails--close' aria-label='Close View More Modal' onClick={() => setModal(undefined)}>
          <MaterialSymbolsLogoutSharp />
        </button>
      )}

      <footer className='fdDetails__footer'>
        <Link to='https://www.themoviedb.org/?language=en-US'>
          <TheMovieDatabaseLogo />
        </Link>
        <Link to='https://www.justwatch.com/us/JustWatch-Streaming-API'>
          <img aria-label='JustWatch API' src={JustWatch} />
        </Link>
      </footer>

      <header className='fdDetails__header'>
        <h2>{data.title}</h2>
      </header>

      <p className='fdDetails__overview'>{data.overview}</p>

      {modal && genreIds.length && (
        <ul className='fdDetails__genres'>
          {genreIds.map((genre, index) => (
            <li key={`genre-${genre}-index-${index}`}>
              {genre}&nbsp;
              {index !== data.genre_ids.length - 1 ? '•' : null}&nbsp;
            </li>
          ))}
        </ul>
      )}

      <div className='fdDetails__extra'>
        {modal && data && (
          <div className='fdDetails__extra__inf'>
            <VoteAverageVisual data={data} />
            {watchProviders && <FDDetailsAvailability data={data} watchProviders={watchProviders} />}
          </div>
        )}
        {!modal && (
          <nav className='fdDetails__extra__nav'>
            <button
              className='fdDetails__extra__nav--details'
              aria-label={`View more details about ${data.title}`}
              onClick={() => {
                setModal('movie');
                setModalData(data);
              }}
            >
              More Details
            </button>
            <FDDetailsCollectionDropdown />
          </nav>
        )}
      </div>

      {modal && (
        <>
          {watchProviders && (
            <div className='fdDetails__providers'>
              {watchProviders.flatrate && (
                <div className='fdDetails__providers__provider'>
                  <header>
                    <h3>{data.title} is Streaming on:</h3>
                  </header>
                  <ul aria-label='Streaming Platforms'>
                    {watchProviders.flatrate.map((provider, index) => (
                      <li key={`provider-stream-${provider.provider_id}-${index}`}>
                        {/* {provider.provider_name} */}
                        {/* {index !== watchProviders.flatrate!.length - 1 ? ',' : null} */}
                        <img src={`https://image.tmdb.org/t/p/${`original`}/${provider.logo_path}`} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {providers && providers.combined && (
                <div className='fdDetails__providers__provider'>
                  <header>
                    <h3>Rent or Purchase {data.title}</h3>
                  </header>
                  <ul aria-label='Purchase or rental available on Platforms'>
                    {providers.combined.map((entry) => (
                      <li aria-label={entry.provider_name} key={`provider-buy-${entry.provider_id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w780/${entry.logo_path}`}
                          alt={`${entry.provider_name}`}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {providers && providers.purchasable && providers.purchasable.length > 0 && (
                <div className='fdDetails__providers__provider'>
                  <header>
                    <h3>Purchase {data.title}</h3>
                  </header>
                  <ul aria-label='Purchase available on Platforms'>
                    {providers.purchasable.map((entry) => (
                      <li aria-label={entry.provider_name} key={`provider-buy-${entry.provider_id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w780/${entry.logo_path}`}
                          alt={`${entry.provider_name}`}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {providers && providers.purchasable && providers.purchasable.length > 0 && (
                <div className='fdDetails__providers__provider'>
                  <header>
                    <h3>Rent {data.title}</h3>
                  </header>
                  <ul aria-label='Rental available on Platforms'>
                    {providers.purchasable.map((entry) => (
                      <li aria-label={entry.provider_name} key={`provider-rent-${entry.provider_id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w780/${entry.logo_path}`}
                          alt={`${entry.provider_name}`}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
};

export default FDDetails;
