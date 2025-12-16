import { IcBaselineError } from 'app/film-database/assets/svg/icons';
import { forwardRef } from 'react';

const FDCollectionsErrorHandler = forwardRef<HTMLDivElement>(({}, errorRef) => {
  return (
    <div className='fdCollectionsErrorHandler' ref={errorRef} data-error='false'>
      <div>
        <IcBaselineError /> Collection contains this movie
      </div>
    </div>
  );
});
export default FDCollectionsErrorHandler;
