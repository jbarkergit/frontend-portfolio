import { useMemo, useState, type JSX } from 'react';
import {
  MaterialSymbolsCircle,
  MaterialSymbolsArrowShapeUpStack2,
  MaterialSymbolsArrowLeftAlt,
  MaterialSymbolsArrowRightAlt,
} from '~/portfolio/features/contact/assets/ContactFormSVG';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const ContactFormBook = ({
  errors,
  ProjectHubBtn,
  PreviousStepBtn,
}: {
  errors: Record<string, string>;
  ProjectHubBtn: () => JSX.Element;
  PreviousStepBtn: () => JSX.Element;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Dates
  const dates = useMemo(
    () => ({
      today: new Date(),
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
    }),
    [currentDate]
  );

  const { today, year, month } = dates;

  // Helpers
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const isToday = (date: Date) => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // Map suppliers
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const maps = useMemo(
    () => ({
      daysInMonth: Array.from({ length: lastDayOfMonth.getDate() }, (_, i) => new Date(year, month, i + 1)),
      emptyDays: Array.from({ length: firstDayOfMonth.getDay() }, () => null),
    }),
    [lastDayOfMonth]
  );

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

      <div className='contact__form__step__calendar'>
        <nav className='contact__form__step__calendar__head'>
          <button
            aria-label='Previous Month'
            type='button'
            onClick={prevMonth}>
            <MaterialSymbolsArrowLeftAlt />
          </button>
          <div>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
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
              className='contact__form__step__calendar__weekdays__day'
              key={`calendar-day-${day}`}>
              {day}
            </li>
          ))}
        </ul>
        <ul className='contact__form__step__calendar__selection'>
          {maps.emptyDays.map((_, i) => (
            <li
              className='contact__form__step__calendar__selection__opt'
              key={`calendar-empty-day-${i}`}
            />
          ))}
          {maps.daysInMonth.map((date) => (
            <li
              className='contact__form__step__calendar__selection__opt'
              key={`calendar-date-${date.toDateString()}`}>
              <button
                aria-label={`Select ${date}`}
                type='button'
                style={{ backgroundColor: isToday(date) ? '#4f46e5' : undefined }}>
                {date.getDate()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <nav className='contact__form__step__stepper'>
        <div className='contact__form__step__stepper__section'>
          {PreviousStepBtn()}{' '}
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
