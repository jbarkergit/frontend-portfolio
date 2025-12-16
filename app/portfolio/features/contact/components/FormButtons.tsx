import { useFeatureState } from 'app/portfolio/context/FeatureStateContext';
import {
  MaterialSymbolsArrowLeftAlt,
  MaterialSymbolsArrowRightAlt,
  MaterialSymbolsOutgoingMail,
} from 'app/portfolio/features/contact/assets/ContactFormSVG';
import { useFormActiveStep } from 'app/portfolio/features/contact/context/FormActiveStepContext';
import { useBookingActive } from 'app/portfolio/features/contact/context/FormBookingActiveContext';
import { useFormErrors } from 'app/portfolio/features/contact/context/FormErrorsContext';
import { useValidateForm } from 'app/portfolio/features/contact/hooks/useValidateForm';

const Next = () => {
  const { formRef, activeStepIndex, updateActiveStep } = useFormActiveStep();
  const { errors, setErrors } = useFormErrors();
  const { setIsBookingActive } = useBookingActive();

  return (
    <button
      className='contact__form__step__stepper__section__button'
      aria-label='Continue to next step'
      type='button'
      onClick={() => {
        if (!errors) {
          useValidateForm(formRef, activeStepIndex, setErrors, setIsBookingActive);
          if (!Object.entries(errors).length) updateActiveStep(1);
        }
      }}
    >
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
      onClick={() => updateActiveStep(-1)}
    >
      <span>
        <MaterialSymbolsArrowLeftAlt />
      </span>
    </button>
  );
};

const Submit = () => {
  return (
    <button className='contact__form__step__stepper__section__button' aria-label='Submit form' type='submit'>
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
          setFeatureState((prev) => ({ ...prev, contactFormActive: false }));
        }}
      >
        <MaterialSymbolsArrowLeftAlt />
      </button>
    </nav>
  );
};

export const FormButtons = { previous: <Previous />, next: <Next />, submit: <Submit />, return: <Return /> };
