import { useFeatureState } from '~/portfolio/context/FeatureStateContext';
import { MaterialSymbolsArrowLeftAlt } from '~/portfolio/features/contact/assets/ContactFormSVG';
import { useFormActiveStep } from '~/portfolio/features/contact/context/FormActiveStepContext';

const ContactSubmitted = () => {
  const { updateActiveStep } = useFormActiveStep();
  const { setFeatureState } = useFeatureState();

  return (
    <section className='contact'>
      <div className='contact__submission'>
        <header className='contact__submission__header'>
          <h2 className='contact__submission__header__h2'>Your inquiry has been successfully submitted.</h2>{' '}
          <p className='contact__submission__header--p'>
            Your matter is important, and every effort will be made to provide a prompt response.
          </p>
        </header>
        <nav className='contact__submission__nav'>
          <button
            className='contact__submission__nav__button'
            aria-label='Return to Contact Information'
            type='button'
            onClick={() => {
              updateActiveStep(0);
              setFeatureState((prev: any) => ({ ...prev, contactFormActive: false }));
            }}>
            <span className='contact__submission__nav__button--span'>
              <MaterialSymbolsArrowLeftAlt />
            </span>
            <span className='contact__submission__nav__button--span'>Return to the portfolio hub</span>
          </button>
        </nav>
      </div>
    </section>
  );
};

export default ContactSubmitted;
