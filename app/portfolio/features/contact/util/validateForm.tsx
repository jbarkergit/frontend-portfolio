import { zodSchema } from 'app/base/validation/zodSchema';
import type { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';

type ValidationResult = {
  formData: FormData;
  fieldErrors: Record<string, string>;
};

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

export const validateForm = (
  formRef: React.RefObject<HTMLFormElement | null>,
  activeStepIndex: React.RefObject<number>,
  setErrors: Dispatch<SetStateAction<Record<string, string>>>,
  setIsBookingActive: React.Dispatch<React.SetStateAction<boolean>>
): ValidationResult | undefined => {
  const form = formRef.current;
  if (!form) return undefined;

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
  let fieldErrors: ValidationResult['fieldErrors'] = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path[0];

      if (typeof path === 'string') {
        fieldErrors[path] = issue.message;
      }
    }
  }

  setErrors(fieldErrors);
  return { formData, fieldErrors };
};
