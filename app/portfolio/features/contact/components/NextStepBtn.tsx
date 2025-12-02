import { useFormActiveStep } from '~/portfolio/features/contact/context/FormActiveStepContext';
import { MaterialSymbolsArrowRightAlt } from '~/portfolio/features/contact/assets/ContactFormSVG';
import { z } from 'zod';
import { zodSchema } from '~/base/validation/zodSchema';
import { useFormErrors } from '~/portfolio/features/contact/context/FormErrorsContext';
import { useBookingActive } from '~/portfolio/features/contact/context/FormBookingActiveContext';

const contactInformationSchema = z.object({
  fullName: zodSchema.shape.fullName,
  emailAddress: zodSchema.shape.emailAddress,
  phoneNumber: zodSchema.shape.phoneNumber,
  agency: zodSchema.shape.agency,
  role: zodSchema.shape.role,
});

const inquirySchema = z.object({
  title: zodSchema.shape.inquiryTitle,
  message: zodSchema.shape.message,
});

const NextStepBtn = () => {
  const { formRef, activeStepIndex, updateActiveStep } = useFormActiveStep();
  const { setErrors } = useFormErrors();
  const { isBookingActive, setIsBookingActive } = useBookingActive();

  const validate = () => {
    const form = formRef.current;
    const validator = activeStepIndex.current === 0 ? contactInformationSchema : inquirySchema;

    if (form) {
      const formData = new FormData(form);
      const formObject = Object.fromEntries(formData.entries());
      const result = validator.safeParse(formObject);

      if (validator === contactInformationSchema) {
        setIsBookingActive(formObject['phoneNumber'] !== '');
      }

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};

        for (const issue of result.error.issues) {
          if (typeof issue.path[0] === 'string') {
            fieldErrors[issue.path[0]] = issue.message;
          }
        }

        setErrors(fieldErrors);
        return;
      }

      updateActiveStep(1);
    } else {
      console.error('Failed to identify form reference.');
    }
  };

  return (
    <button
      className='contact__form__step__stepper__section__button'
      aria-label='Continue to next step'
      type='button'
      onClick={validate}>
      <span>Next</span>
      <span>
        <MaterialSymbolsArrowRightAlt />
      </span>
    </button>
  );
};

export default NextStepBtn;
