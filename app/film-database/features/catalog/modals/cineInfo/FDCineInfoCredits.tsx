import GenericCarousel from 'app/film-database/components/carousel/GenericCarousel';
import { tmdbCall } from 'app/film-database/composables/tmdbCall';
import type { TmdbResponseFlat } from 'app/film-database/composables/types/TmdbResponse';
import { useModalContext } from 'app/film-database/context/ModalContext';
import { useModalTrailerContext } from 'app/film-database/context/ModalTrailerContext';
import { useEffect, useState } from 'react';

type Cast = TmdbResponseFlat['credits']['cast'];
type Crew = TmdbResponseFlat['credits']['crew'];
type CastAndCrew = { cast: Cast; crew: Crew };
type UnwrapArray<T> = T extends Array<infer U> ? U : T;

const FDCineInfoCredits = () => {
  const { modal } = useModalContext();
  const { modalTrailer } = useModalTrailerContext();
  const [credits, setCredits] = useState<CastAndCrew | undefined>(undefined);

  useEffect(() => {
    if (modal !== 'movie' || !modalTrailer) return;

    const controller = new AbortController();

    const fetchCredits = async () => {
      if (!modalTrailer) return;

      const creditsResponse = await tmdbCall(controller, { credits: modalTrailer.id });
      const { cast, crew } = creditsResponse.response;

      const dedupedCast = new Map<string, UnwrapArray<Cast>>();
      const dedupedCrew = new Map<string, UnwrapArray<Crew>>();

      function isCast(person: UnwrapArray<Cast> | UnwrapArray<Crew>): person is UnwrapArray<Cast> {
        return 'known_for_department' in person;
      }
      function isCrew(person: UnwrapArray<Cast> | UnwrapArray<Crew>): person is UnwrapArray<Crew> {
        return 'job' in person;
      }

      function processPeople<T extends UnwrapArray<Cast> | UnwrapArray<Crew>>(people: T[], dedupeMap: Map<string, T>) {
        for (const person of people) {
          if (!person) continue;

          let key: string;

          if (isCast(person)) {
            key = `${person.name}-${person.known_for_department}`;
          } else if (isCrew(person)) {
            key = `${person.name}-${person.job}`;
          } else {
            continue;
          }

          if (!dedupeMap.has(key)) dedupeMap.set(key, person as T);
        }
      }

      processPeople(cast, dedupedCast);
      processPeople(crew, dedupedCrew);

      setCredits({
        cast: Array.from(dedupedCast.values()),
        crew: Array.from(dedupedCrew.values()),
      });
    };

    fetchCredits();

    return () => controller.abort();
  }, [modal, modalTrailer]);

  if (!credits) return null;

  return (
    <>
      <GenericCarousel carouselIndex={1} carouselName={'cinemaInformation'} heading={'Cast'} data={credits.cast} />
      <GenericCarousel carouselIndex={2} carouselName={'cinemaInformation'} heading={'Crew'} data={credits.crew} />
    </>
  );
};

export default FDCineInfoCredits;
