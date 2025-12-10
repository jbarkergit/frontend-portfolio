import { useState } from 'react';
import { FormActiveStepProvider } from '~/portfolio/features/contact/context/FormActiveStepContext';
import { FormErrorsProvider } from '~/portfolio/features/contact/context/FormErrorsContext';
import ContactForm from '~/portfolio/features/contact/ContactForm';
import ContactSubmitted from '~/portfolio/features/contact/ContactSubmitted';
import { BookingActiveProvider } from '~/portfolio/features/contact/context/FormBookingActiveContext';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  return isSubmitted ? (
    <FormActiveStepProvider>
      <ContactSubmitted />
    </FormActiveStepProvider>
  ) : (
    <FormActiveStepProvider>
      <FormErrorsProvider>
        <BookingActiveProvider>
          <ContactForm setIsSubmitted={setIsSubmitted} />
        </BookingActiveProvider>
      </FormErrorsProvider>
    </FormActiveStepProvider>
  );
};

export default Contact;
