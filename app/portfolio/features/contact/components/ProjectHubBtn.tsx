import { useFeatureState } from '~/portfolio/context/FeatureStateContext';
import { useFormActiveStep } from '~/portfolio/features/contact/context/FormActiveStepContext';
import { MaterialSymbolsArrowLeftAlt } from '~/portfolio/features/contact/assets/ContactFormSVG';

export const ProjectHubBtn = () => {
  const { updateActiveStep } = useFormActiveStep();
  const { setFeatureState } = useFeatureState();

  return (
    <nav className='contact__form__step__header__nav'>
      <button
        aria-label='Return to Contact Information'
        type='button'
        onClick={() => {
          updateActiveStep(0);
          setFeatureState((prev: any) => ({ ...prev, contactFormActive: false }));
        }}>
        <MaterialSymbolsArrowLeftAlt />
      </button>
    </nav>
  );
};

export default ProjectHubBtn;
