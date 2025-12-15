import FDDetails from 'app/film-database/components/details/FDDetails';
import FDiFrame from 'app/film-database/components/iframe/FDiFrame';
import FDCineInfoCredits from 'app/film-database/features/catalog/modals/cineInfo/FDCineInfoCredits';

const FDCineInfo = () => {
  return (
    <div className='fdCineInfo'>
      <FDiFrame type={'modal'} />
      <FDDetails modal={true} />
      <FDCineInfoCredits />
    </div>
  );
};

export default FDCineInfo;
