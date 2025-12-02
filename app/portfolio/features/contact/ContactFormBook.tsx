import { useMemo, useRef, useState } from 'react';
import {
  MaterialSymbolsCircle,
  MaterialSymbolsArrowLeftAlt,
  MaterialSymbolsArrowRightAlt,
  MaterialSymbolsOutgoingMail,
} from '~/portfolio/features/contact/assets/ContactFormSVG';
import PreviousStepBtn from '~/portfolio/features/contact/components/PreviousStepBtn';
import ProjectHubBtn from '~/portfolio/features/contact/components/ProjectHubBtn';
import { useFormErrors } from '~/portfolio/features/contact/context/FormErrorsContext';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const ContactFormBook = () => {
  const { errors } = useFormErrors();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentDate = useRef(new Date());
  const today = new Date();
  const year = currentDate.current.getFullYear();
  const month = currentDate.current.getMonth();

  // Prevent navigating to months earlier than the current month
  const prevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    const min = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prev < min) return;
    currentDate.current = prev;
  };

  const nextMonth = () => (currentDate.current = new Date(year, month + 1, 1));

  const isToday = (date: Date) =>
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = useMemo(
    () => Array.from({ length: lastDay.getDate() }, (_, i) => new Date(year, month, i + 1)),
    [year, month]
  );

  const emptyDays = Array.from({ length: firstDay.getDay() }, () => null);

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
          <h3>Booking</h3>
        </div>
        <h2>Let's book a call.</h2>
      </header>
      <div className='contact__form__step__calendar'>
        <nav className='contact__form__step__calendar__head'>
          <button
            aria-label='Previous Month'
            type='button'
            onClick={prevMonth}>
            <MaterialSymbolsArrowLeftAlt />
          </button>
          <div>{currentDate.current.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
          <button
            aria-label='Next Month'
            type='button'
            onClick={nextMonth}>
            <MaterialSymbolsArrowRightAlt />
          </button>
        </nav>
        <ul className='contact__form__step__calendar__weekdays'>
          {weekdays.map((day) => (
            <li
              key={`weekday-${day}`}
              className='contact__form__step__calendar__weekdays__day'>
              {day}
            </li>
          ))}
        </ul>
        <ul className='contact__form__step__calendar__selection'>
          {emptyDays.map((_, i) => (
            <li
              key={`empty-${i}`}
              className='contact__form__step__calendar__selection__opt'
            />
          ))}
          {daysInMonth.map((date) => {
            const isPast = date < today;
            const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
            return (
              <li
                key={date.toDateString()}
                className='contact__form__step__calendar__selection__opt'>
                <button
                  type='button'
                  aria-label={`Select ${date.toDateString()}`}
                  disabled={isPast}
                  onClick={() => !isPast && setSelectedDate(date)}
                  style={{
                    backgroundColor: isSelected ? '#2563eb' : undefined,
                    color: isPast || isToday(date) ? '#515151' : '#fff',
                    cursor: isPast ? 'not-allowed' : 'pointer',
                  }}>
                  {date.getDate()}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <input
        type='hidden'
        name='bookingDate'
        value={selectedDate ? selectedDate.toISOString() : ''}
        aria-invalid={!!errors.bookingDate}
        aria-describedby='bookingDate-error'
      />
      {errors.bookingDate && (
        <div
          id='bookingDate-error'
          className='contact__form__step__ul__li__error'
          role='alert'>
          {errors.bookingDate}
        </div>
      )}
      <nav className='contact__form__step__stepper'>
        <div className='contact__form__step__stepper__section'>
          <PreviousStepBtn />
          <button
            className='contact__form__step__stepper__section__button'
            aria-label='Submit form'
            type='submit'>
            <span>
              <MaterialSymbolsOutgoingMail />
            </span>
          </button>
        </div>
      </nav>
    </section>
  );
};

export default ContactFormBook;
