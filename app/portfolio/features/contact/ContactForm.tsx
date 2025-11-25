import { useCallback, useRef, useState, type SVGProps } from 'react';
import { contactSchema } from '~/base/validation/zodSchema';
import { useFeatureState } from '~/portfolio/context/FeatureStateContext';
import {
  MaterialSymbolsArrowLeftAlt,
  MaterialSymbolsArrowRightAlt,
} from '~/portfolio/features/contact/assets/ContactFormSVG';
import ContactFormBook from '~/portfolio/features/contact/steps/ContactFormBook';
import ContactFormInformation from '~/portfolio/features/contact/steps/ContactFormInformation';
import ContactFormInquiry from '~/portfolio/features/contact/steps/ContactFormInquiry';
import { submitWeb3Form } from '~/portfolio/features/contact/util/submitWeb3Form';

const ContactForm = ({ setIsSubmitted }: { setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { setFeatureState } = useFeatureState();

  const isMountedRef = useRef<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const contactContainerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLLIElement[]>([]);
  const activeStepIndex = useRef<number>(0);

  const submittingRef = useRef<boolean>(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
      await submitWeb3Form(formData);
      setErrors({});
      form.reset();
      contactContainerRef.current?.removeAttribute('data-submission-invalid');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      contactContainerRef.current?.setAttribute('data-submission-invalid', 'true');
    } finally {
      submittingRef.current = false;
    }
  };

  const updateSteps = () => {
    if (!formRef.current) return;
    const steps = Array.from(formRef.current.children) as HTMLLIElement[];

    if (steps) {
      isMountedRef.current = true;
      stepsRef.current = steps;
    }
  };

  const handleSection = (index?: number) => {
    if (!isMountedRef.current) updateSteps();
    if (!stepsRef.current.length) return;

    const clamped = Math.min(Math.max(index ?? activeStepIndex.current, 0), stepsRef.current.length - 1);

    for (let i = 0; i < stepsRef.current.length; i++) {
      const step = stepsRef.current[i];
      if (step) step.setAttribute('data-toggle', i === clamped ? 'true' : 'false');
    }

    activeStepIndex.current = clamped;
  };

  const ProjectHubBtn = useCallback(
    () => (
      <nav className='contact__form__step__header__nav'>
        <button
          aria-label='Return to Contact Information'
          type='button'
          onClick={() => {
            handleSection(0);
            setFeatureState((prev: any) => ({ ...prev, contactFormActive: false }));
          }}>
          <MaterialSymbolsArrowLeftAlt />
        </button>
      </nav>
    ),
    []
  );

  const PreviousStepBtn = useCallback(
    () => (
      <button
        className='contact__form__step__stepper__section__button'
        aria-label='Return to previous step'
        type='button'
        onClick={() => handleSection(activeStepIndex.current - 1)}>
        <span>
          <MaterialSymbolsArrowLeftAlt />
        </span>
      </button>
    ),
    []
  );

  const NextStepBtn = useCallback(
    () => (
      <button
        className='contact__form__step__stepper__section__button'
        aria-label='Continue to next step'
        type='button'
        onClick={() => handleSection(activeStepIndex.current + 1)}>
        <span>Next</span>
        <span>
          <MaterialSymbolsArrowRightAlt />
        </span>
      </button>
    ),
    []
  );

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
        onSubmit={handleSubmit}>
        <ContactFormInformation
          errors={errors}
          ProjectHubBtn={ProjectHubBtn}
          NextStepBtn={NextStepBtn}
        />
        <ContactFormInquiry
          errors={errors}
          ProjectHubBtn={ProjectHubBtn}
          PreviousStepBtn={PreviousStepBtn}
          NextStepBtn={NextStepBtn}
        />
        <ContactFormBook
          errors={errors}
          PreviousStepBtn={PreviousStepBtn}
          ProjectHubBtn={ProjectHubBtn}
        />
      </form>
    </section>
  );
};

export default ContactForm;
