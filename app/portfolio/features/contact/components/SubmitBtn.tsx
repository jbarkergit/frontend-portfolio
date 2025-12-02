import { MaterialSymbolsOutgoingMail } from '~/portfolio/features/contact/assets/ContactFormSVG';

const SubmitBtn = () => {
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

export default SubmitBtn;
