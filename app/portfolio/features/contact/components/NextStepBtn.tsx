import { useFormActiveStep } from '~/portfolio/features/contact/context/FormActiveStepContext';
import { MaterialSymbolsArrowRightAlt } from '~/portfolio/features/contact/assets/ContactFormSVG';

const NextStepBtn = () => {
  const { updateActiveStep } = useFormActiveStep();

  return (
    <button
      className='contact__form__step__stepper__section__button'
      aria-label='Continue to next step'
      type='button'
      onClick={() => updateActiveStep(1)}>
      <span>Next</span>
      <span>
        <MaterialSymbolsArrowRightAlt />
      </span>
    </button>
  );
};

export default NextStepBtn;
