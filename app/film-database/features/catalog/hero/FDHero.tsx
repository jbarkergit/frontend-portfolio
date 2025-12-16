import FDDetails from '../../../components/details/FDDetails';
import FDiFrame from '../../../components/iframe/FDiFrame';

const FDHero = () => {
  return (
    <div className='fdHero'>
      <div className='fdHero__container'>
        <FDDetails modal={false} />
        <FDiFrame type={'hero'} />
      </div>
    </div>
  );
};

export default FDHero;
