import IFrameController from 'app/film-database/components/iframe/iframe-controller/IFrameController';
import { tmdbCall } from 'app/film-database/composables/tmdbCall';
import type { TmdbResponse } from 'app/film-database/composables/types/TmdbResponse';
import { useHeroDataContext } from 'app/film-database/context/HeroDataContext';
import { useModalDataContext } from 'app/film-database/context/ModalDataContext';
import { type UserCollection, useUserCollectionContext } from 'app/film-database/context/UserCollectionContext';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import type { YouTubeEvent, YouTubeProps } from 'react-youtube';
import YouTube from 'react-youtube';

/** This component utilizes YouTube Player API
 * https://developers.google.com/youtube/iframe_api_reference
 * via third party library https://github.com/tjallingt/react-youtube
 */
export type iFramePlayState = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued';

const playStates: Record<number, iFramePlayState> = {
  [-1]: 'unstarted',
  0: 'ended',
  1: 'playing',
  2: 'paused',
  3: 'buffering',
  5: 'cued',
} as const;

const FDiFrame = memo(({ type }: { type: 'hero' | 'modal' }) => {
  // Flags
  const isHero = useRef<boolean>(type === 'hero');
  const isModal = useRef<boolean>(type === 'modal');

  // Data
  const { heroData } = useHeroDataContext();
  const { modalData, setModalData } = useModalDataContext();
  const typedData = useMemo(
    () => (isHero.current ? heroData : isModal.current ? modalData : undefined),
    [heroData, modalData]
  );

  // User Collections
  const { setUserCollections } = useUserCollectionContext();

  // iFrame
  const playerRef = useRef<YouTube | null>(null);
  const currentTrailerIDRef = useRef<number | undefined>(undefined);
  const [trailer, setTrailer] = useState<TmdbResponse['number']['videos']['results'][number] | undefined>(undefined);
  const [playState, setPlayState] = useState<iFramePlayState>('ended'); // Converts IFrameController to a controlled component

  /**
   * Fetch trailer
   */
  useEffect(() => {
    if (!typedData) return;

    const userRequestedNewTrailer: boolean = typedData.id !== currentTrailerIDRef.current;
    if (!userRequestedNewTrailer) return;

    const controller = new AbortController();

    const fetchTrailer = async (): Promise<void> => {
      const response = await tmdbCall(controller, { videos: typedData.id });

      // Filter by 'Official Trailer'
      let trailers = response.response.results.filter((obj) => obj.name.includes('Official Trailer'));

      // If 'Official Trailer' filter does not yield results, filter by 'Trailer'
      if (!trailers.length) {
        trailers = response.response.results.filter((obj) => obj.name.includes('Trailer'));
      }

      if (trailers[0]) {
        setTrailer(trailers[0]);
        currentTrailerIDRef.current = typedData.id;
      } else {
        setTrailer(undefined);
        currentTrailerIDRef.current = undefined;
      }
    };

    fetchTrailer();

    return () => controller.abort();
  }, [typedData]);

  /**
   * UPDATE TRAILER QUEUE
   */
  const updateTrailerQueue = () => {
    if (isModal.current) {
      // Capture current trailer ID
      const endedTrailerID = currentTrailerIDRef.current;

      setUserCollections((prev) => {
        // Capture current trailer queue
        const trailerQueue: UserCollection = prev['user-collection-0'] ?? { data: [], header: 'Trailer Queue' };

        // GUARD: Advance logic if the ENDED trailer is in the trailer queue
        const trailerIsInQueue: boolean = trailerQueue.data.some((entry) => entry.id === endedTrailerID);
        if (!trailerIsInQueue) return prev;

        // Capture current trailer index
        const currentTrailerIndex = trailerQueue.data.findIndex((entry) => entry.id === endedTrailerID);

        // Identify next trailer in queue by index access + 1 OR - 1
        const nextTrailer = trailerQueue.data[currentTrailerIndex + 1] ?? trailerQueue.data[currentTrailerIndex - 1];
        setModalData(nextTrailer);

        // Remove current trailer from the queue
        const filteredQueue = trailerQueue.data.filter((entry) => entry.id !== endedTrailerID);

        // Return updated userCollections
        return {
          ...prev,
          ['user-collection-0']: {
            ...trailerQueue,
            data: filteredQueue,
          },
        };
      });
    }
  };

  /**
   * IFRAME DESTRUCTOR
   */
  const destroyPlayer = async () => {
    setTrailer(undefined);
    await playerRef.current?.destroyPlayer();
    updateTrailerQueue();
  };

  /**
   * YOUTUBE PLAYER PARAMETERS
   * https://developers.google.com/youtube/player_parameters
   */
  const iFrameOptions: YouTubeProps['opts'] = useMemo(
    () => ({
      width: undefined,
      height: undefined,
      videoId: typedData ? String(typedData.id) : undefined,
      playerVars: {
        autoplay: 1,
        cc_lang_pref: 'eng',
        cc_load_policy: 1,
        controls: isHero.current ? 0 : 1, // 0 = not displayed
        disablekb: isHero.current ? 1 : 0, // 0 = enabled
        fs: isHero.current ? 0 : 1, // 0 = disabled
        hl: 'eng',
        iv_load_policy: 3,
        loop: 0,
        playsinline: 1,
        rel: 0,
        widget_referrer: undefined,
        mute: 1, // Autoplay Requirement: untyped in react-youtube library
      },
    }),
    [typedData]
  );

  /**
   * TSX
   */
  return (
    <section className='fdiFrame' data-type={type}>
      {trailer ? (
        <>
          {isHero.current && playerRef.current?.internalPlayer && (
            <IFrameController player={playerRef.current.internalPlayer} playState={playState} />
          )}
          <YouTube
            ref={playerRef}
            videoId={`${trailer.key}`}
            opts={iFrameOptions}
            className='fdiFrame__player'
            iframeClassName='fdiFrame__player__iframe'
            title={`YouTube video player: ${trailer.name}`}
            style={undefined}
            loading={'eager'}
            onPlay={() => setPlayState('playing')}
            onStateChange={(event: YouTubeEvent<number>) => {
              setPlayState(playStates[event.data as keyof typeof playStates] ?? 'cued');
            }}
            // DEPRECIATED?: onPlaybackQualityChange={(event: YouTubeEvent<string>) => onPlaybackQualityChange(event.data)}
            onEnd={destroyPlayer}
            onError={destroyPlayer}
          />
        </>
      ) : (
        <picture className='fdiFrame__player'>
          <img
            src={`https://image.tmdb.org/t/p/original/${heroData ? heroData.backdrop_path : undefined}`}
            alt={heroData ? heroData.title : undefined}
          />
        </picture>
      )}
    </section>
  );
});

export default FDiFrame;
