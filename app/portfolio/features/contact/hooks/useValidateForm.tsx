import { z } from 'zod';
import { zodSchema } from '~/base/validation/zodSchema';

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

export const useValidateForm = (
  formRef: React.RefObject<HTMLFormElement | null>,
  activeStepIndex: React.RefObject<number>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  setIsBookingActive: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const form = formRef.current;
  if (!form) return;

  const stepIndex = activeStepIndex.current;
  const validator = stepIndex === 0 ? contactInformationSchema : stepIndex === 1 ? inquirySchema : bookingSchema;

  const formData = new FormData(form);
  const formObject = Object.fromEntries(formData.entries());
  const result = validator.safeParse(formObject);

  // Enable booking section of form
  if (validator === contactInformationSchema) {
    setIsBookingActive(formObject['phoneNumber'] !== '');
  }

  // Validate, set errors
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of result.error.issues) {
      const path = issue.path[0];

      if (typeof path === 'string') {
        fieldErrors[path] = issue.message;
      }
    }

    setErrors(fieldErrors);
  }

  return formData;
};
