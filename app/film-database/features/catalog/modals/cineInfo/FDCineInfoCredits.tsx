import GenericCarousel from 'app/film-database/components/carousel/GenericCarousel';
import { tmdbCall } from 'app/film-database/composables/tmdbCall';
import type { TmdbResponseFlat } from 'app/film-database/composables/types/TmdbResponse';
import { useModalContext } from 'app/film-database/context/ModalContext';
import { useModalTrailerContext } from 'app/film-database/context/ModalTrailerContext';
import { useEffect, useState } from 'react';

const FDCineInfoCredits = () => {
  const { modal } = useModalContext();
  const { modalTrailer } = useModalTrailerContext();
  const [credits, setCredits] = useState<TmdbResponseFlat['credits'] | undefined>(undefined);

  useEffect(() => {
    if (!modal) return;

    const controller = new AbortController();

    const fetch = async (): Promise<void> => {
      if (!modalTrailer) return;
      const credits = await tmdbCall(controller, { credits: modalTrailer.id });
      setCredits(credits.response);
    };
    fetch();

    return () => controller.abort();
  }, [modalTrailer]);

  if (credits)
    return (
      <>
        <GenericCarousel carouselIndex={1} carouselName={'cinemaInformation'} heading={'Cast'} data={credits.cast} />
        <GenericCarousel carouselIndex={2} carouselName={'cinemaInformation'} heading={'Crew'} data={credits.crew} />
      </>
    );
};

export default FDCineInfoCredits;
