import { useFormActiveStep } from '~/portfolio/features/contact/context/FormActiveStepContext';
import { MaterialSymbolsArrowLeftAlt } from '~/portfolio/features/contact/assets/ContactFormSVG';

const PreviousStepBtn = () => {
  const { updateActiveStep } = useFormActiveStep();

  return (
    <button
      className='contact__form__step__stepper__section__button'
      aria-label='Return to previous step'
      type='button'
      onClick={() => updateActiveStep(-1)}>
      <span>
        <MaterialSymbolsArrowLeftAlt />
      </span>
    </button>
  );
};

export default PreviousStepBtn;
