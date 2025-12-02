import { useFormErrors } from '~/portfolio/features/contact/context/FormErrorsContext';
import {
  MaterialSymbolsCircle,
  MaterialSymbolsErrorCircleRoundedSharp,
} from '~/portfolio/features/contact/assets/ContactFormSVG';
import NextStepBtn from '~/portfolio/features/contact/components/NextStepBtn';
import ProjectHubBtn from '~/portfolio/features/contact/components/ProjectHubBtn';

const contactInformationInputs = {
  name: { htmlFor: 'name', inputType: 'text' },
  emailAddress: { htmlFor: 'email', inputType: 'email' },
  phoneNumber: { htmlFor: 'phone', inputType: 'tel' },
  business: { htmlFor: 'business', inputType: 'text' },
  role: { htmlFor: 'role', inputType: 'text' },
} as const;

const ContactFormInformation = () => {
  const { errors, setErrors } = useFormErrors();

  return (
    <section
      className='contact__form__step'
      data-toggle='true'>
      <header className='contact__form__step__header'>
        <ProjectHubBtn />
        <div className='contact__form__step__header__wrapper'>
          <span>
            <MaterialSymbolsCircle />
          </span>
          <h3>Contact Information</h3>
        </div>
        <h2>Let's get started with your contact information.</h2>
      </header>
      <ul className='contact__form__step__ul'>
        {Object.entries(contactInformationInputs).map(([key, { htmlFor, inputType }]) => (
          <>
            {errors[key] && (
              <li key={`error-${errors[key]}`}>
                <div
                  className='contact__form__step__ul__error'
                  role='alert'>
                  <span>
                    <MaterialSymbolsErrorCircleRoundedSharp />
                  </span>
                  <span>{errors[key]}</span>
                </div>
              </li>
            )}
            <li
              className='contact__form__step__ul__li'
              key={`contact-form-information-${key}`}>
              <label
                htmlFor={htmlFor}
                className='contact__form__step__ul__li__label'>
                {htmlFor === 'business'
                  ? 'Agency (optional)'
                  : htmlFor === 'role'
                    ? 'Role (optional)'
                    : htmlFor.replaceAll('-', ' ')}
              </label>
              <input
                className='contact__form__step__ul__li__input'
                id={htmlFor}
                type={inputType}
                name={key}
                placeholder=' '
                aria-invalid={!!errors[key]}
                aria-describedby={`${htmlFor}-error`}
              />
            </li>
          </>
        ))}
      </ul>
      <nav className='contact__form__step__stepper'>
        <div className='contact__form__step__stepper__section' />
        <div className='contact__form__step__stepper__section'>
          <NextStepBtn />
        </div>
      </nav>
    </section>
  );
};

export default ContactFormInformation;
