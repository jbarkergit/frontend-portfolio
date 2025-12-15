import ContactForm from 'app/portfolio/features/contact/ContactForm';
import ContactSubmitted from 'app/portfolio/features/contact/ContactSubmitted';
import { FormActiveStepProvider } from 'app/portfolio/features/contact/context/FormActiveStepContext';
import { BookingActiveProvider } from 'app/portfolio/features/contact/context/FormBookingActiveContext';
import { FormErrorsProvider } from 'app/portfolio/features/contact/context/FormErrorsContext';
import { useState } from 'react';

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
