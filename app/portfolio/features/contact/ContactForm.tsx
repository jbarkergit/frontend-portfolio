import { useRef } from 'react';
import { useFormActiveStep } from '~/portfolio/features/contact/context/FormActiveStepContext';
import { useFormErrors } from '~/portfolio/features/contact/context/FormErrorsContext';
import ContactFormBook from '~/portfolio/features/contact/ContactFormBook';
import ContactFormInformation from '~/portfolio/features/contact/ContactFormInformation';
import ContactFormInquiry from '~/portfolio/features/contact/ContactFormInquiry';
import { useBookingActive } from '~/portfolio/features/contact/context/FormBookingActiveContext';
import { useValidateForm } from '~/portfolio/features/contact/hooks/useValidateForm';

const submitFormToWeb3 = async (formData: FormData): Promise<void> => {
  formData.append('access_key', import.meta.env.VITE_WEB_FORMS_KEY!);
  const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
  const result = (await response.json()) as { success: boolean };
  if (!result.success) throw new Error(JSON.stringify(result));
};

const ContactForm = ({ setIsSubmitted }: { setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { formRef, activeStepIndex } = useFormActiveStep();
  const { isBookingActive } = useBookingActive();
  const { errors, setErrors } = useFormErrors();
  const { setIsBookingActive } = useBookingActive();

  const isSubmittingRef = useRef<boolean>(false);

  const onSubmit = async (): Promise<void> => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const formData = useValidateForm(formRef, activeStepIndex, setErrors, setIsBookingActive);
    if (!formData) return;

    if (Object.entries(errors).length) {
      isSubmittingRef.current = false;
      return;
    }

    try {
      await submitFormToWeb3(formData);
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
        }}>
        <ContactFormInformation />
        <ContactFormInquiry />
        {isBookingActive && <ContactFormBook />}
      </form>
    </section>
  );
};

export default ContactForm;
