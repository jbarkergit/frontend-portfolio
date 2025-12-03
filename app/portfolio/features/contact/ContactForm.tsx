import { useRef } from 'react';
import { useFormActiveStep } from '~/portfolio/features/contact/context/FormActiveStepContext';
import { useFormErrors } from '~/portfolio/features/contact/context/FormErrorsContext';
import ContactFormBook from '~/portfolio/features/contact/ContactFormBook';
import ContactFormInformation from '~/portfolio/features/contact/ContactFormInformation';
import ContactFormInquiry from '~/portfolio/features/contact/ContactFormInquiry';
import { useBookingActive } from '~/portfolio/features/contact/context/FormBookingActiveContext';
import { z } from 'zod';
import { zodSchema } from '~/base/validation/zodSchema';

const contactSchema = z.object({
  firstName: zodSchema.shape.firstName,
  lastName: zodSchema.shape.lastName,
  phoneNumber: zodSchema.shape.phoneNumber,
  emailAddress: zodSchema.shape.emailAddress,
  business: zodSchema.shape.agency,
  role: zodSchema.shape.role,
  message: zodSchema.shape.message,
});

const ContactForm = ({ setIsSubmitted }: { setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { errors, setErrors } = useFormErrors();
  const { formRef } = useFormActiveStep();
  const { isBookingActive } = useBookingActive();

  // Nodes
  const contactContainerRef = useRef<HTMLDivElement>(null);

  // Flags
  const submittingRef = useRef<boolean>(false);

  const submitFormToWeb3 = async (formData: FormData): Promise<void> => {
    formData.append('access_key', import.meta.env.VITE_WEB_FORMS_KEY!);
    const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
    const result = (await response.json()) as { success: boolean };
    if (!result.success) throw new Error(JSON.stringify(result));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (submittingRef.current) return;
    submittingRef.current = true;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    const result = contactSchema.safeParse(formObject);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        if (typeof issue.path[0] === 'string') {
          fieldErrors[issue.path[0]] = issue.message;
        }
      }

      setErrors(fieldErrors);
      submittingRef.current = false;
      return;
    }

    try {
      await submitFormToWeb3(formData);
      setErrors({});
      form.reset();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <section
      className='contact'
      ref={contactContainerRef}>
      <header className='contact__heading'>
        <h2>Contact Form</h2>
      </header>
      <form
        className='contact__form'
        ref={formRef}
        onSubmit={onSubmit}>
        <ContactFormInformation />
        <ContactFormInquiry />
        {isBookingActive && <ContactFormBook />}
      </form>
    </section>
  );
};

export default ContactForm;
