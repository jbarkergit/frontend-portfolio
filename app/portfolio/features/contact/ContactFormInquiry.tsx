import {
  MaterialSymbolsCircle,
  MaterialSymbolsErrorCircleRoundedSharp,
  MaterialSymbolsList,
} from 'app/portfolio/features/contact/assets/ContactFormSVG';
import { FormButtons } from 'app/portfolio/features/contact/components/FormButtons';
import { useBookingActive } from 'app/portfolio/features/contact/context/FormBookingActiveContext';
import { useFormErrors } from 'app/portfolio/features/contact/context/FormErrorsContext';
import { useRef, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

const inquiryInputs = {
  inquiryTitle: { htmlFor: 'inquiry', inputType: 'select' },
  message: { htmlFor: 'message', inputType: 'text' },
} as const;

const inquiryOptions = [
  `I’m looking to hire a React developer for a full-time role.`,
  `I need a React front-end developer to build a new web application.`,
  `I need a React front-end developer to add new features or improve an existing project.`,
  `I'm looking for a React developer for debugging, optimization, or ongoing maintenance.`,
  `I have designs I need implemented in React.`,
  `I’d like to discuss a partnership or joint project using React.`,
] as const;

const ContactFormInquiry = () => {
  const { errors } = useFormErrors();
  const { isBookingActive } = useBookingActive();

  const accordionRef = useRef<HTMLUListElement>(null);

  const [titleValue, setTitleValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const untoggleAccordion = (e: PointerEvent) => {
    if (accordionRef.current?.contains(e.target as Node)) {
      const target = e.target as HTMLElement;
      if (!(target instanceof HTMLButtonElement)) return;
      setTitleValue(target.textContent);
      accordionRef.current.setAttribute('data-selected', 'true');
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
    <section className='contact__form__step' data-toggle='false'>
      <header className='contact__form__step__header'>
        {FormButtons.return}
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
                  <div className='contact__form__step__ul__error' role='alert'>
                    <span>
                      <MaterialSymbolsErrorCircleRoundedSharp />
                    </span>
                    <span>{errors[key]}</span>
                  </div>
                </li>
              )}
              <li className='contact__form__step__ul__li contact__form__step__ul__dropdown'>
                {htmlFor === 'inquiry' ? (
                  <>
                    <div
                      className='contact__form__step__ul__li__select'
                      aria-label='Open inquiry menu'
                      tabIndex={0}
                      onClick={toggleAccordion}
                    >
                      <span>{titleValue !== '' ? titleValue : 'Select a title'}</span>
                      <span>
                        <MaterialSymbolsList />
                      </span>
                    </div>
                    <input
                      className='contact__form__step__ul__li__select__input'
                      id={`${htmlFor}`}
                      name={key}
                      type='hidden'
                      value={titleValue}
                    />
                    <ul
                      ref={accordionRef}
                      className='contact__form__step__ul__li__accordion'
                      id={htmlFor}
                      aria-invalid={!!errors[key]}
                      aria-describedby={`${htmlFor}-error`}
                      tabIndex={0}
                      data-toggle='false'
                    >
                      {inquiryOptions.map((option, index) => (
                        <li
                          className='contact__form__step__ul__li__select__option'
                          key={`inquiry-option-${index}`}
                          tabIndex={0}
                        >
                          <button className='contact__form__step__ul__li__select__option__input'>{option}</button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <label htmlFor={htmlFor} className='contact__form__step__ul__li__label'>
                      Message (Optional)
                    </label>
                    <textarea
                      id={`${htmlFor}`}
                      name={key}
                      placeholder=' '
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      aria-invalid={!!errors['message']}
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
        <div className='contact__form__step__stepper__section'>{FormButtons.return}</div>
        <div className='contact__form__step__stepper__section'>
          {isBookingActive ? FormButtons.next : FormButtons.submit}
        </div>
      </nav>
    </section>
  );
};

export default ContactFormInquiry;
