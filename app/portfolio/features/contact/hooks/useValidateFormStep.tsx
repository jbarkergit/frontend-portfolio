import { z } from 'zod';
import { zodSchema } from '~/base/validation/zodSchema';
import { useFormActiveStep } from '~/portfolio/features/contact/context/FormActiveStepContext';
import { useBookingActive } from '~/portfolio/features/contact/context/FormBookingActiveContext';
import { useFormErrors } from '~/portfolio/features/contact/context/FormErrorsContext';

const contactInformationSchema = z.object({
  fullName: zodSchema.shape.fullName,
  emailAddress: zodSchema.shape.emailAddress,
  phoneNumber: zodSchema.shape.phoneNumber,
  agency: zodSchema.shape.agency,
  role: zodSchema.shape.role,
});

const inquirySchema = z.object({
  inquiryTitle: zodSchema.shape.inquiryTitle,
  message: zodSchema.shape.message,
});

const bookingSchema = z.object({ bookingData: zodSchema.shape.bookingDate });

export const useValidateFormStep = () => {
  const { formRef, activeStepIndex, updateActiveStep } = useFormActiveStep();
  const { setErrors } = useFormErrors();
  const { setIsBookingActive } = useBookingActive();

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
  }
};
