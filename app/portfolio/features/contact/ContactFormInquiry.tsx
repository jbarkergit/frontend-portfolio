import { Fragment, useRef } from 'react';
import { useFormErrors } from '~/portfolio/features/contact/context/FormErrorsContext';
import {
  MaterialSymbolsCircle,
  MaterialSymbolsErrorCircleRoundedSharp,
  MaterialSymbolsList,
} from '~/portfolio/features/contact/assets/ContactFormSVG';
import NextStepBtn from '~/portfolio/features/contact/components/NextStepBtn';
import PreviousStepBtn from '~/portfolio/features/contact/components/PreviousStepBtn';
import ProjectHubBtn from '~/portfolio/features/contact/components/ProjectHubBtn';
import { useBookingActive } from '~/portfolio/features/contact/context/FormBookingActiveContext';
import SubmitBtn from '~/portfolio/features/contact/components/SubmitBtn';

const inquiryInputs = {
  inquiry: { htmlFor: 'inquiry', inputType: 'select' },
  message: { htmlFor: 'message', inputType: 'text' },
} as const;

const ContactFormInquiry = () => {
  const { errors } = useFormErrors();
  const { isBookingActive } = useBookingActive();

  const inquiryTitleRef = useRef<HTMLSpanElement>(null);
  const accordionRef = useRef<HTMLUListElement>(null);

  const untoggleAccordion = (e: PointerEvent) => {
    if (!inquiryTitleRef.current) return;

    if (accordionRef.current?.contains(e.target as Node)) {
      const target = e.target as HTMLElement;

      if (target instanceof HTMLInputElement) {
        inquiryTitleRef.current.textContent = target.placeholder;
      }

      if (inquiryTitleRef.current.textContent !== 'Select A Title') {
        accordionRef.current.setAttribute('data-selected', 'true');
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
            <Fragment key={`contact-form-${key}`}>
              {errors[key] && (
                <li>
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
                      tabIndex={0}
                      data-toggle='false'>
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
                          <input
                            className='contact__form__step__ul__li__select__option__input'
                            id={`${htmlFor}`}
                            readOnly
                            value={`${option}`}
                            name={key}
                            placeholder={`${option}`}
                            aria-invalid={!!errors[key]}
                            aria-describedby={`${htmlFor}-error`}
                          />
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
              </li>
            </Fragment>
          );
        })}
      </ul>
      <nav className='contact__form__step__stepper'>
        <div className='contact__form__step__stepper__section'>
          <PreviousStepBtn />
        </div>
        <div className='contact__form__step__stepper__section'>{isBookingActive ? <NextStepBtn /> : <SubmitBtn />}</div>
      </nav>
    </section>
  );
};

export default ContactFormInquiry;
