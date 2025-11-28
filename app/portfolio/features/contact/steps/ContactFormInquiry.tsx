import { useRef } from 'react';
import { useFormErrors } from '~/portfolio/features/contact/context/FormErrorsContext';
import { MaterialSymbolsCircle, MaterialSymbolsList } from '~/portfolio/features/contact/assets/ContactFormSVG';
import NextStepBtn from '~/portfolio/features/contact/components/NextStepBtn';
import PreviousStepBtn from '~/portfolio/features/contact/components/PreviousStepBtn';
import ProjectHubBtn from '~/portfolio/features/contact/components/ProjectHubBtn';

const inquiryInputs = {
  inquiry: { htmlFor: 'inquiry', inputType: 'select' },
  message: { htmlFor: 'message', inputType: 'text' },
} as const;

const ContactFormInquiry = () => {
  const { errors, setErrors } = useFormErrors();

  const inquiryTitleRef = useRef<HTMLSpanElement>(null);
  const accordionRef = useRef<HTMLUListElement>(null);

  const untoggleAccordion = (e: PointerEvent) => {
    if (!inquiryTitleRef.current) return;

    if (accordionRef.current?.contains(e.target as Node)) {
      inquiryTitleRef.current.textContent = (e.target as HTMLSpanElement).textContent;

      if (!inquiryTitleRef.current.hasAttribute('data-toggle')) {
        inquiryTitleRef.current.setAttribute('data-toggle', 'true');
      }
    }

    accordionRef.current?.setAttribute('data-toggle', 'false');
    document.removeEventListener('pointerdown', untoggleAccordion);
  };

  const toggleAccordion = () => {
    if (!accordionRef.current) return;
    accordionRef.current.setAttribute('data-toggle', 'true');
    window.document.addEventListener('pointerdown', untoggleAccordion);
  };

  return (
    <section
      className='contact__form__step'
      data-toggle='false'>
      <header className='contact__form__step__header'>
        <ProjectHubBtn />
        <div className='contact__form__step__header__wrapper'>
          <span>
            <MaterialSymbolsCircle />
          </span>
          <h3>Inquiry Details</h3>
        </div>
        <h2>What’s the focus of your inquiry, and how can I be of service?</h2>
      </header>
      <ul className='contact__form__step__ul'>
        {Object.entries(inquiryInputs).map(([key, { htmlFor }]) => {
          return (
            <li
              className='contact__form__step__ul__li contact__form__step__ul__dropdown'
              key={`contact-form-inquiry-${key}`}>
              {htmlFor === 'inquiry' ? (
                <>
                  <div
                    className='contact__form__step__ul__li__select'
                    aria-label='Open inquiry menu'
                    tabIndex={0}
                    onClick={toggleAccordion}>
                    <span ref={inquiryTitleRef}>Select a title</span>
                    <span>
                      <MaterialSymbolsList />
                    </span>
                  </div>
                  <ul
                    ref={accordionRef}
                    className='contact__form__step__ul__li__accordion'
                    id={htmlFor}
                    aria-invalid={!!errors[key]}
                    aria-describedby={`${htmlFor}-error`}
                    tabIndex={0}>
                    {[
                      `I’m looking to hire a React developer for a full-time role.`,
                      `I need a React front-end developer to build a new web application.`,
                      `I need a React front-end developer to add new features or improve an existing project.`,
                      `I'm looking for a React developer for debugging, optimization, or ongoing maintenance.`,
                      `I have designs I need implemented in React.`,
                      `I’d like to discuss a partnership or joint project using React.`,
                    ].map((option, index) => (
                      <li
                        className='contact__form__step__ul__li__select__option'
                        key={`inquiry-option-${index}`}
                        tabIndex={0}>
                        {option}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <label
                    htmlFor={htmlFor}
                    className='contact__form__step__ul__li__label'>
                    Message (Optional)
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    placeholder=' '
                    aria-invalid={!!errors.message}
                    aria-describedby='message-error'
                  />
                </>
              )}

              {errors[key] && (
                <div
                  className='contact__form__step__ul__li__error'
                  id={`${htmlFor}-error`}
                  role='alert'
                  aria-live='polite'>
                  {errors[key]}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <nav className='contact__form__step__stepper'>
        <div className='contact__form__step__stepper__section'>
          <PreviousStepBtn />
        </div>
        <div className='contact__form__step__stepper__section'>
          <NextStepBtn />
        </div>
      </nav>
    </section>
  );
};

export default ContactFormInquiry;
