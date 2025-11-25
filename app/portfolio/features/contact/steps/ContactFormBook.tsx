import type { JSX } from 'react';
import {
  MaterialSymbolsCircle,
  MaterialSymbolsArrowShapeUpStack2,
} from '~/portfolio/features/contact/assets/ContactFormSVG';

const ContactFormBook = ({
  errors,
  ProjectHubBtn,
  PreviousStepBtn,
}: {
  errors: Record<string, string>;
  ProjectHubBtn: () => JSX.Element;
  PreviousStepBtn: () => JSX.Element;
}) => {
  return (
    <section
      className='contact__form__step'
      data-toggle='false'>
      <header className='contact__form__step__header'>
        {ProjectHubBtn()}
        <div className='contact__form__step__header__wrapper'>
          <span>
            <MaterialSymbolsCircle />
          </span>
          <h3>Booking</h3>
        </div>
        <h2>Let's book a call.</h2>
      </header>
      <ul className='contact__form__step__ul'></ul>
      <nav className='contact__form__step__stepper'>
        <div className='contact__form__step__stepper__section'>{PreviousStepBtn()}</div>
        <div className='contact__form__step__stepper__section'>
          <button
            className='contact__form__step__stepper__section__button'
            aria-label='Submit form'
            type='submit'>
            <span>Submit</span>
            <span>
              <MaterialSymbolsArrowShapeUpStack2 />
            </span>
          </button>
        </div>
      </nav>
    </section>
  );
};

export default ContactFormBook;
