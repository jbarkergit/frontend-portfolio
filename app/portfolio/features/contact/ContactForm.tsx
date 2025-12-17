import ContactFormBook from 'app/portfolio/features/contact/ContactFormBook';
import ContactFormInformation from 'app/portfolio/features/contact/ContactFormInformation';
import ContactFormInquiry from 'app/portfolio/features/contact/ContactFormInquiry';
import { useFormActiveStep } from 'app/portfolio/features/contact/context/FormActiveStepContext';
import { useBookingActive } from 'app/portfolio/features/contact/context/FormBookingActiveContext';
import { useFormErrors } from 'app/portfolio/features/contact/context/FormErrorsContext';
import { validateForm } from 'app/portfolio/features/contact/util/validateForm';
import { useRef } from 'react';

const submitFormToWeb3 = async (formData: FormData): Promise<void> => {
  formData.append('access_key', import.meta.env['VITE_WEB_FORMS_KEY']!);
  const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
  const result = (await response.json()) as { success: boolean };
  if (!result.success) throw new Error(JSON.stringify(result));
};

const ContactForm = ({ setIsSubmitted }: { setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { formRef, activeStepIndex } = useFormActiveStep();
  const { isBookingActive } = useBookingActive();
  const { setErrors } = useFormErrors();
  const { setIsBookingActive } = useBookingActive();

  const isSubmittingRef = useRef<boolean>(false);

  const onSubmit = async (): Promise<void> => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const result = validateForm(formRef, activeStepIndex, setErrors, setIsBookingActive);
    if (!result) return;

    if (Object.entries(result.fieldErrors).length) {
      isSubmittingRef.current = false;
      return;
    }

    try {
      await submitFormToWeb3(result.formData);
      setErrors({});
      formRef.current?.reset();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <section className='contact'>
      <header className='contact__heading'>
        <h2>Contact Form</h2>
      </header>
      <form
        className='contact__form'
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <ContactFormInformation />
        <ContactFormInquiry />
        {isBookingActive && <ContactFormBook />}
      </form>
    </section>
  );
};

export default ContactForm;
