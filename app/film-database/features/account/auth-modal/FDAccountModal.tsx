import { firebaseAuth } from 'app/base/firebase/config/firebaseConfig';
import { normalizeFirebaseAuthError } from 'app/base/firebase/firestore/helpers/normalizeFirebaseAuthError';
import { zodSchema } from 'app/base/validation/zodSchema';
import { TablerBrandGithubFilled, DeviconGoogle, GameIconsSpy } from 'app/film-database/assets/svg/icons';
import FDAccountModalPoster from 'app/film-database/features/account/auth-modal/FDAccountModalPoster';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signInAnonymously,
} from 'firebase/auth';
import { forwardRef, useState, useRef, type HTMLAttributes } from 'react';
import { z, type ZodIssue } from 'zod';

const registrationSchema = z
  .object({
    firstName: zodSchema.shape.firstName,
    lastName: zodSchema.shape.lastName,
    emailAddress: zodSchema.shape.emailAddress,
    password: zodSchema.shape.password,
    passwordConfirmation: z.string().min(1, 'Please retype your password.'),
    tos: zodSchema.shape.tos,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: 'Passwords must match',
  });

const loginSchema = z.object({
  emailAddress: zodSchema.shape.emailAddress,
  password: zodSchema.shape.password,
});

const registration = [
  {
    labelId: 'firstName',
    id: 'fdUserAccountFirstName',
    name: 'firstName',
    label: 'First name',
    type: 'text',
    inputMode: 'text',
    required: true,
    placeholder: 'John',
  },
  {
    labelId: 'lastName',
    id: 'fdUserAccountLastName',
    name: 'lastName',
    label: 'Last name',
    type: 'text',
    inputMode: 'text',
    required: false,
    placeholder: 'Doe',
  },
  {
    labelId: 'emailAddress',
    id: 'fdUserAccountEmailAddress',
    name: 'emailAddress',
    label: 'Email address',
    type: 'email',
    inputMode: 'email',
    required: true,
    placeholder: 'johndoe@gmail.com',
    minLength: 3,
    maxLength: 76,
  },
  {
    labelId: 'password',
    id: 'fdUserAccountPassword',
    name: 'password',
    label: 'Password',
    type: 'password',
    inputMode: 'text',
    required: true,
    placeholder: '••••••••',
    minLength: 8,
    maxLength: 32,
  },
  {
    labelId: 'passwordConfirmation',
    id: 'fdUserAccountPasswordConfirmation',
    name: 'passwordConfirmation',
    label: 'Retype password',
    type: 'password',
    inputMode: 'text',
    required: true,
    placeholder: '••••••••',
    minLength: 8,
    maxLength: 32,
  },
];

const login = [
  {
    labelId: 'Email address',
    id: 'fdUserAccountSignInEmailAddress',
    name: 'emailAddress',
    label: 'Email address',
    type: 'email',
    inputMode: 'email',
    required: true,
    placeholder: 'johndoe@gmail.com',
    minLength: 3,
    maxLength: 76,
  },
  {
    labelId: 'Password',
    id: 'fdUserAccountSignInPassword',
    name: 'password',
    label: 'Password',
    type: 'password',
    inputMode: 'text',
    required: true,
    placeholder: '••••••••',
    minLength: 8,
    maxLength: 32,
  },
];

const fieldStore = {
  registration: registration,
  login: login,
} as const;

const schemas = {
  registration: registrationSchema,
  login: loginSchema,
} as const;

const providerMap = {
  github: GithubAuthProvider,
  google: GoogleAuthProvider,
} as const;

const FDAccountModal = forwardRef<HTMLDivElement, {}>(({}, accountRef) => {
  const [activeForm, setActiveForm] = useState<'registration' | 'login'>('registration');
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const [errors, setErrors] = useState<ZodIssue[]>([]);

  /** Retrieves field errors for JSX */
  const getFieldError = (name: string) => errors.find((err) => err.path[0] === name)?.message;

  /** Create FormData, validate with zod, return result */
  const getParsedForm = (e: React.FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries()) as Record<string, any>;
    formObject['tos'] = formData.has('tos');
    const result = schemas[activeForm].safeParse(formObject);
    return result;
  };

  /** Firebase auth error helper */
  const handleError = (error: unknown) => {
    const firebaseError = normalizeFirebaseAuthError(error);
    console.error(firebaseError);
    setErrors((p) => [
      ...p,
      { code: 'firebase' as any, path: ['__global'], message: firebaseError.message, source: 'firebase' },
    ]);
  };

  /** On form submission, parse form data, handle errors, invoke corresponding active form's Firestore utility */
  const submittingRef = useRef<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submittingRef.current) return;
    submittingRef.current = true;

    const result = getParsedForm(e);

    if (!result.success) {
      setErrors(result.error.issues.filter((issue) => typeof issue.path[0] === 'string'));
    } else {
      setErrors([]);

      try {
        const { emailAddress, password } = result.data;

        if (activeForm === 'registration') {
          await createUserWithEmailAndPassword(firebaseAuth, emailAddress, password);
          await signInWithEmailAndPassword(firebaseAuth, emailAddress, password);
        } else {
          await signInWithEmailAndPassword(firebaseAuth, emailAddress, password);
        }

        e.currentTarget.reset();
      } catch (error) {
        handleError(error);
      }
    }

    submittingRef.current = false;
    return;
  };

  /** Handle auth provider login */
  const isAuthorizingViaProviderRef = useRef<boolean>(false);

  const handleAuthProviderLogin = async (provider: keyof typeof providerMap) => {
    if (isAuthorizingViaProviderRef.current) return;
    isAuthorizingViaProviderRef.current = true;

    const ProviderClass = providerMap[provider];
    const authProvider = new ProviderClass();

    try {
      await signInWithPopup(firebaseAuth, authProvider);
    } catch (error) {
      console.error(error);
      handleError(error);
    }

    isAuthorizingViaProviderRef.current = false;
  };

  /** Handle user request to reset password */
  const isRequestingPasswordResetRef = useRef<boolean>(false);

  const handlePasswordReset = async (emailInputElement: HTMLInputElement) => {
    if (isRequestingPasswordResetRef.current) return;
    isRequestingPasswordResetRef.current = true;

    const emailAddress = emailInputElement.value;

    if (!emailAddress) {
      alert('Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(firebaseAuth, emailAddress);
      alert('Check your email for password reset instructions.');
    } catch (error) {
      handleError(error);
    }

    isRequestingPasswordResetRef.current = false;
  };

  /** Animates fieldsets on form state change */
  const isActiveFormChangingRef = useRef<boolean>(false);

  const onActiveFormChange = () => {
    if (isActiveFormChangingRef.current) return;
    isActiveFormChangingRef.current = true;

    fieldsetRef.current?.setAttribute('data-animate', 'unmount');
    setTimeout(() => {
      setActiveForm((f) => (f === 'registration' ? 'login' : 'registration'));
      requestAnimationFrame(() => fieldsetRef.current?.setAttribute('data-animate', 'mount'));
      isActiveFormChangingRef.current = false;
    }, 600);
  };

  return (
    <div
      className='fdAccount'
      data-layout-carousel>
      <div
        className='fdAccount__container'
        ref={accountRef}
        data-visible='false'>
        <main className='fdAccount__container__wrapper'>
          <form
            className='fdAccount__container__wrapper__form'
            onSubmit={handleSubmit}
            noValidate>
            <fieldset
              className='fdAccount__container__wrapper__form__fieldset'
              ref={fieldsetRef}
              data-animate='mount'
              aria-labelledby='legend-id'>
              <div>
                <legend id='legend-id'>
                  {activeForm === 'registration' ? `Get Started Now` : `Start a new session`}
                </legend>
                <p>
                  {activeForm === 'registration'
                    ? `Welcome to Film Database, create an account to start a session.`
                    : `Welcome back to Film Database, let's get you logged in.`}
                </p>
              </div>
              <div>
                <button
                  type='button'
                  aria-label='Log in with Github'
                  onClick={() => handleAuthProviderLogin('github')}>
                  <TablerBrandGithubFilled /> <span>Log in with GitHub</span>
                </button>
                <button
                  type='button'
                  aria-label='Log in with Google'
                  onClick={() => handleAuthProviderLogin('google')}>
                  <DeviconGoogle /> <span>Log in with Google</span>
                </button>
                <button
                  type='button'
                  aria-label='Log in Anonymously'
                  onClick={() => signInAnonymously(firebaseAuth)}>
                  <GameIconsSpy /> <span>Log in Anonymously</span>
                </button>
              </div>
              <ul
                className='fdAccount__container__wrapper__form__fieldset__ul'
                data-form={activeForm}>
                {fieldStore[activeForm].map(
                  ({ labelId, id, name, label, type, inputMode, required, placeholder, minLength, maxLength }) => (
                    <li
                      key={id}
                      className='fdAccount__container__wrapper__form__fieldset__ul__li'>
                      <label
                        id={labelId}
                        htmlFor={id}>
                        {label}
                      </label>
                      <input
                        id={id}
                        name={name}
                        type={type}
                        inputMode={inputMode as HTMLAttributes<HTMLInputElement>['inputMode']}
                        size={12}
                        required={required}
                        aria-invalid={!!errors.some((err) => err.path.includes(name))}
                        autoCapitalize={type === 'text' ? 'words' : 'off'}
                        placeholder={placeholder}
                        minLength={minLength}
                        maxLength={maxLength}
                      />
                      {getFieldError(name) && (
                        <div className='fdAccount__container__wrapper__form__fieldset__ul__li--error'>
                          {getFieldError(name)}
                        </div>
                      )}
                    </li>
                  )
                )}
                {activeForm === 'registration' && (
                  <li className='fdAccount__container__wrapper__form__fieldset__ul__li'>
                    <input
                      type='checkbox'
                      name='tos'
                      id='tos'
                    />
                    <label htmlFor='tos'>
                      <span>I have read and agree to the</span>&nbsp;
                      <button aria-label='Read terms and conditions'>terms and conditions</button>
                    </label>
                  </li>
                )}

                {errors.length > 0 && (
                  <div
                    key='error-tos'
                    className='fdAccount__container__wrapper__form__fieldset__ul__li--error'>
                    {errors.find((error) => error.code === ('firebase' as any))?.message}
                  </div>
                )}
              </ul>
              <nav>
                <div>
                  <button
                    type='submit'
                    aria-label={
                      activeForm === 'registration' ? 'Submit registration form' : 'Sign in with your credentials'
                    }>
                    <span>{activeForm === 'registration' ? 'Complete Registration' : 'Log in with credentials'}</span>
                  </button>
                </div>
                <div>
                  <button
                    type='button'
                    aria-label={activeForm === 'registration' ? 'Log into an existing account' : 'Create a new account'}
                    onClick={onActiveFormChange}>
                    {activeForm === 'registration' ? 'Log into an existing account' : 'Create a new account'}
                  </button>
                  {activeForm === 'login' && (
                    <>
                      {'• '}
                      <button
                        type='button'
                        aria-label='Request a password reset'
                        onClick={() => {
                          const emailInput = document.getElementById(
                            'fdUserAccountSignInEmailAddress'
                          ) as HTMLInputElement;
                          handlePasswordReset(emailInput);
                        }}>
                        Reset password
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </fieldset>
          </form>
        </main>
        <FDAccountModalPoster />
      </div>
    </div>
  );
});

export default FDAccountModal;
