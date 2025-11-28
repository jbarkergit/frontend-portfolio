import { useState } from 'react';
import { FormActiveStepProvider } from '~/portfolio/features/contact/context/FormActiveStepContext';
import { FormErrorsProvider } from '~/portfolio/features/contact/context/FormErrorsContext';
import ContactForm from '~/portfolio/features/contact/ContactForm';
import ContactSubmitted from '~/portfolio/features/contact/ContactSubmitted';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  return isSubmitted ? (
    <ContactSubmitted />
  ) : (
    <FormActiveStepProvider>
      <FormErrorsProvider>
        <ContactForm setIsSubmitted={setIsSubmitted} />
      </FormErrorsProvider>
    </FormActiveStepProvider>
  );
};

export default Contact;
