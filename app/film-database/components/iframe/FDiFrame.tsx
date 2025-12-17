import IFrameController from 'app/film-database/components/iframe/iframe-controller/IFrameController';
import { tmdbCall } from 'app/film-database/composables/tmdbCall';
import type { TmdbResponseFlat } from 'app/film-database/composables/types/TmdbResponse';
import { useHeroDataContext } from 'app/film-database/context/HeroDataContext';
import { useModalTrailerContext } from 'app/film-database/context/ModalTrailerContext';
import { useUserCollectionContext } from 'app/film-database/context/UserCollectionContext';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { YouTubeEvent, YouTubePlayer, YouTubeProps } from 'react-youtube';
import YouTube from 'react-youtube';

/** This component utilizes YouTube Player API
 * https://developers.google.com/youtube/iframe_api_reference
 * via third party library https://github.com/tjallingt/react-youtube
 */

type iFramePlayState = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering';
export type PlayerPlayState = iFramePlayState | 'cued' | undefined;

const playStates: Record<number, iFramePlayState> = {
  [-1]: 'unstarted',
  0: 'ended',
  1: 'playing',
  2: 'paused',
  3: 'buffering',
} as const;

const FDiFrame = memo(({ type }: { type: 'hero' | 'modal' }) => {
  // Trailer related state
  const heroDataContext = type === 'hero' ? useHeroDataContext() : undefined;
  const modalTrailerContext = type === 'modal' ? useModalTrailerContext() : undefined;

  const heroData = heroDataContext?.heroData;
  const modalTrailer = modalTrailerContext?.modalTrailer;
  const setModalTrailer = modalTrailerContext?.setModalTrailer;

  // Modal related state
  const userCollectionContext = type === 'modal' ? useUserCollectionContext() : undefined;

  const userCollections = userCollectionContext?.userCollections;
  const setUserCollections = userCollectionContext?.setUserCollections;

  // Locally scoped state
  const [trailer, setTrailer] = useState<TmdbResponseFlat['videos']['results'][number] | undefined>(undefined);
  const [playState, setPlayState] = useState<PlayerPlayState>(undefined); // The modal player cannot be stateless due to the conditional rendering of IFrameController.

  // console.log(heroData, modalTrailer, userCollections, trailer, playState);

  // Player reference
  const playerRef = useRef<YouTube | null>(null);

  // Conditionals
  const modalTrailerId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (type === 'hero' && !heroData) return;
    if (type === 'modal') {
      if (!modalTrailer) return;
      if (modalTrailerId.current === modalTrailer.id) return;
    }

    const controller = new AbortController();

    const fetchTrailer = async (): Promise<void> => {
      const id = type === 'hero' ? heroData?.id : modalTrailer?.id;
      if (!id) return;

      const videos = await tmdbCall(controller, { videos: id });
      let filteredEntries = videos.response.results.filter((obj) => obj.name.includes('Official Trailer'));

      if (!filteredEntries.length) {
        filteredEntries = videos.response.results.filter((obj) => obj.name.includes('Trailer'));
      }

      if (type === 'modal') modalTrailerId.current = id;
      setTrailer(filteredEntries[0]);
    };

    fetchTrailer();

    return () => controller.abort();
  }, [heroData, modalTrailer]);

  // Player destruction
  const destroyMainPlayer = useCallback((target: YouTubePlayer) => {
    if (type !== 'hero') return;
    target.destroy();
    setTrailer(undefined);
    return;
  }, []);

  const destroyModalPlayer = useCallback(() => {
    if (type !== 'modal') return;

    // ID Trailer Queue collection
    let queueCollection = structuredClone(userCollections!['user-collection-0']);
    if (!queueCollection || !queueCollection.data) return;

    // Capture current trailer index
    const trailerQueue = queueCollection.data;
    const currentTrailerIndex = trailerQueue.findIndex((prop) => prop.id === modalTrailer?.id);

    // Set the next trailer at index + 1
    let nextTrailer = trailerQueue[currentTrailerIndex + 1];
    // If a trailer does not exist at index + 1, try index - 1
    if (!nextTrailer) nextTrailer = trailerQueue[currentTrailerIndex - 1];
    // If neither + 1 nor - 1 trailer exists, don't set a new trailer.
    if (nextTrailer) setModalTrailer!(nextTrailer);

    // Remove ended trailer from queueCollection
    queueCollection.data = queueCollection.data.filter((_, i) => i !== currentTrailerIndex);

    // Update userCollections, removing the ended trailer
    setUserCollections!((prev) => ({
      ...prev,
      ['user-collection-0']: {
        ...queueCollection,
      },
    }));
  }, []);

  const destroyPlayer = useCallback((target: YouTubePlayer) => {
    if (type === 'hero') destroyMainPlayer(target);
    else destroyModalPlayer();
  }, []);

  const iFrameOptions = useMemo<YouTubeProps['opts']>(
    () => ({
      height: undefined,
      width: undefined,
      // https://developers.google.com/youtube/player_parameters
      playerVars: {
        autoplay: 1,
        cc_lang_pref: 'eng',
        cc_load_policy: 1,
        // color: undefined,
        controls: type === 'hero' ? 0 : 1, // 0 = not displayed
        disablekb: type === 'hero' ? 1 : 0, // 0 = enabled
        // enablejsapi?: 0 | 1 | undefined;
        // end?: number | undefined;
        fs: type === 'hero' ? 0 : 1, // 0 = disabled
        hl: 'eng',
        iv_load_policy: 3,
        loop: 0,
        // origin: '',
        // playlist?: string | undefined;
        playsinline: 1,
        rel: 0,
        // start?: number | undefined;
        widget_referrer: undefined,
        mute: 1, // Required for autoplay, is not defined by react-youtube lib
      },
    }),
    [type]
  );

  // JSX
  return (
    <section className='fdiFrame' data-type={type}>
      {trailer && (type === 'hero' ? heroData : modalTrailer) ? (
        <>
          {type === 'hero' && playerRef.current?.internalPlayer && (
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
            // onPlaybackQualityChange={(event: YouTubeEvent<string>) => onPlaybackQualityChange(event.data)}
            onEnd={(event: YouTubeEvent) => destroyPlayer(event.target)}
            onError={(event: YouTubeEvent) => destroyPlayer(event.target)}
          />
        </>
      ) : (
        <picture className='fdiFrame__player'>
          <img
            src={`https://image.tmdb.org/t/p/original/${type === 'hero' ? heroData?.backdrop_path : modalTrailer?.backdrop_path}`}
            alt={heroData?.title}
          />
        </picture>
      )}
    </section>
  );
});

export default FDiFrame;
