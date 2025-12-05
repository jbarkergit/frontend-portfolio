import { useFeatureState } from '~/portfolio/context/FeatureStateContext';
import {
  MaterialSymbolsArrowRightAlt,
  MaterialSymbolsArrowLeftAlt,
  MaterialSymbolsOutgoingMail,
} from '~/portfolio/features/contact/assets/ContactFormSVG';
import { useFormActiveStep } from '~/portfolio/features/contact/context/FormActiveStepContext';
import { useValidateFormStep } from '~/portfolio/features/contact/hooks/useValidateFormStep';

const Next = () => {
  return (
    <button
      className='contact__form__step__stepper__section__button'
      aria-label='Continue to next step'
      type='button'
      onClick={useValidateFormStep}>
      <span>Next</span>
      <span>
        <MaterialSymbolsArrowRightAlt />
      </span>
    </button>
  );
};

const Previous = () => {
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

const Submit = () => {
  return (
    <button
      className='contact__form__step__stepper__section__button'
      aria-label='Submit form'
      type='submit'>
      <span>
        <MaterialSymbolsOutgoingMail />
      </span>
    </button>
  );
};

const Return = () => {
  const { updateActiveStep } = useFormActiveStep();
  const { setFeatureState } = useFeatureState();

  return (
    <nav className='contact__form__step__header__nav'>
      <button
        aria-label='Return to Contact Information'
        type='button'
        onClick={() => {
          updateActiveStep(0);
          setFeatureState((prev: any) => ({ ...prev, contactFormActive: false }));
        }}>
        <MaterialSymbolsArrowLeftAlt />
      </button>
    </nav>
  );
};

export const FormButtons = { previous: <Previous />, next: <Next />, submit: <Submit />, return: <Return /> };
