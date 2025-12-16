import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Apple, Google, LinkedIn } from '../../assets/production-images/user-account-svg/PasskeySvgs';
import { userEmailAddressRegex, userPasswordRegex } from '../../validation/ecoRegexPatterns';

//Prop drill from UserAccountModal
type PropType = {
  setUiModal: Dispatch<SetStateAction<string>>;
};

const UserAccountRegistry = ({ setUiModal }: PropType) => {
  const emailAddressInputFieldRef = useRef<HTMLInputElement>(null); //Email Address Input Field Reference
  const passwordInputFieldRef = useRef<HTMLInputElement>(null); //Password Input Field Reference

  //Registry validation state
  const [registry, setRegistry] = useState<{
    firstNameRegistry: string;
    lastNameRegistry: string;
    emailAddressRegistry: string;
    emailAddressValidRegistry: boolean;
    passwordRegistry: string;
    passwordVisible: boolean;
    passwordValidRegistry: boolean;
    passwordRegistryCheck: string;
  }>({
    firstNameRegistry: 'John',
    lastNameRegistry: 'Doe',
    emailAddressRegistry: 'test@test.com',
    emailAddressValidRegistry: true,
    passwordRegistry: 'HelloWorld1!',
    passwordVisible: false,
    passwordValidRegistry: true,
    passwordRegistryCheck: 'HelloWorld1!',
  });

  //Form input value clear hook
  const clearFormInputValues = (): void => {
    setRegistry({
      firstNameRegistry: '',
      lastNameRegistry: '',
      emailAddressRegistry: '',
      emailAddressValidRegistry: false,
      passwordRegistry: '',
      passwordVisible: false,
      passwordValidRegistry: false,
      passwordRegistryCheck: '',
    });
  };

  //RegExp test for email input value -> sets state validation boolean
  useEffect(() => {
    setRegistry({ ...registry, emailAddressValidRegistry: userEmailAddressRegex.test(registry.emailAddressRegistry) });
  }, [registry.emailAddressRegistry]);

  //RegExp test for password input value -> sets state validation boolean
  useEffect(() => {
    setRegistry({ ...registry, passwordValidRegistry: userPasswordRegex.test(registry.passwordRegistry) });
  }, [registry.passwordRegistry]);

  //Input field ERROR state
  const [registryError, setRegistryError] = useState<{
    emailAddressRegistryError: boolean;
    passwordRegistryError: boolean;
  }>({
    emailAddressRegistryError: false,
    passwordRegistryError: false,
  });

  //Email validation -> sets error state boolean
  useEffect(() => {
    registry.emailAddressValidRegistry
      ? setRegistryError({ ...registryError, emailAddressRegistryError: false })
      : setRegistryError({ ...registryError, emailAddressRegistryError: true });
  }, [registry.emailAddressValidRegistry]);

  //Password validation -> sets error state boolean
  useEffect(() => {
    registry.passwordValidRegistry
      ? setRegistryError({ ...registryError, passwordRegistryError: false })
      : setRegistryError({ ...registryError, passwordRegistryError: true });
  }, [registry.passwordValidRegistry]);

  //Registry form submission hook
  const useRegistryFormSubmission = (e: FormEvent): void => {
    e.preventDefault();
    if (registry.emailAddressValidRegistry && registry.passwordValidRegistry) {
      localStorage.setItem('firstName', JSON.stringify(registry.firstNameRegistry));
      localStorage.setItem('emailAddress', JSON.stringify(registry.emailAddressRegistry));
      localStorage.setItem('password', JSON.stringify(registry.passwordRegistry));
      setUiModal('userLogin');
    }
  };

  return (
    <form className='ecoModal__container' onSubmit={useRegistryFormSubmission}>
      <legend>
        <h2>Account Creation</h2>
      </legend>

      <fieldset>
        <div className='firstLastName'>
          <label htmlFor='firstName'>
            <input
              id='capitalize'
              type='text'
              placeholder='First Name'
              value={registry.firstNameRegistry}
              required={true}
              aria-required={'true'}
              autoFocus
              aria-invalid={registry.firstNameRegistry ? 'false' : 'true'}
              aria-describedby='uidnote'
              ref={emailAddressInputFieldRef}
              onClick={() => focus()}
              onChange={(event) => setRegistry({ ...registry, firstNameRegistry: event.target.value })}
            />
          </label>
          <label htmlFor='lastName'>
            <input
              id='capitalize'
              type='text'
              placeholder='Last Name'
              value={registry.lastNameRegistry}
              required={true}
              aria-required={'true'}
              aria-invalid={registry.lastNameRegistry ? 'false' : 'true'}
              aria-describedby='uidnote'
              ref={emailAddressInputFieldRef}
              onClick={() => focus()}
              onChange={(event) => setRegistry({ ...registry, lastNameRegistry: event.target.value })}
            />
          </label>
        </div>
        <label htmlFor='emailAddress'>
          <input
            type='text'
            placeholder='Email Address'
            value={registry.emailAddressRegistry}
            required={true}
            aria-required={'true'}
            aria-invalid={registry.emailAddressValidRegistry ? 'false' : 'true'}
            aria-describedby='uidnote'
            ref={emailAddressInputFieldRef}
            onClick={() => focus()}
            onChange={(event) => setRegistry({ ...registry, emailAddressRegistry: event.target.value.toLowerCase() })}
          />
        </label>
        {registryError.emailAddressRegistryError ? (
          <figure className='inputFieldErrorMessage'>
            <figcaption style={{ display: 'none' }}>Error Message</figcaption>
            <p>Invalid Email Address</p>
          </figure>
        ) : null}
        <label htmlFor='password' className='passwordLabel'>
          <input
            type={registry.passwordVisible ? 'text' : 'password'}
            placeholder='Password'
            value={registry.passwordRegistry}
            required={true}
            aria-required={'true'}
            aria-invalid={registry.passwordValidRegistry ? 'false' : 'true'}
            aria-describedby='pwdnote'
            ref={passwordInputFieldRef}
            onClick={() => focus()}
            onChange={(event) => setRegistry({ ...registry, passwordRegistry: event.target.value })}
          />
          <button
            className='passwordLabel__visibility'
            aria-label='Toggle password visibility'
            onClick={(e) => {
              e.preventDefault();
              setRegistry({ ...registry, passwordVisible: registry.passwordVisible ? false : true });
            }}
          >
            {registry.passwordVisible ? (
              <svg xmlns='http://www.w3.org/2000/svg' width='1.2em' height='1.2em' viewBox='0 0 14 14'>
                <g fill='none' stroke='hsl(0, 0%, 20%)' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M13.23 6.33a1 1 0 0 1 0 1.34C12.18 8.8 9.79 11 7 11S1.82 8.8.77 7.67a1 1 0 0 1 0-1.34C1.82 5.2 4.21 3 7 3s5.18 2.2 6.23 3.33Z'></path>
                  <circle cx='7' cy='7' r='2'></circle>
                </g>
              </svg>
            ) : (
              <svg xmlns='http://www.w3.org/2000/svg' width='1.2em' height='1.2em' viewBox='0 0 14 14'>
                <g fill='none' stroke='hsl(0, 0%, 20%)' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M12.29 5.4c.38.34.7.67.94.93a1 1 0 0 1 0 1.34C12.18 8.8 9.79 11 7 11h-.4m-2.73-.87a12.4 12.4 0 0 1-3.1-2.46a1 1 0 0 1 0-1.34C1.82 5.2 4.21 3 7 3a6.56 6.56 0 0 1 3.13.87M12.5 1.5l-11 11'></path>
                  <path d='M5.59 8.41A2 2 0 0 1 5 7a2 2 0 0 1 2-2a2 2 0 0 1 1.41.59M8.74 8a2 2 0 0 1-.74.73'></path>
                </g>
              </svg>
            )}
          </button>
        </label>
        {registryError.passwordRegistryError && registry.passwordRegistry.length > 3 ? (
          <figure className='inputFieldErrorMessage'>
            <figcaption>Error Message</figcaption>
            <p>
              Password must be eight characters minimum, contain at least one special character, one lowercase and
              uppercase letter.
            </p>
          </figure>
        ) : null}
        <label htmlFor='passwordCheck' className='passwordLabel'>
          <input
            type={registry.passwordVisible ? 'text' : 'password'}
            placeholder='Retype your password'
            value={registry.passwordRegistryCheck}
            required={true}
            aria-required={'true'}
            aria-invalid={registry.passwordValidRegistry ? 'false' : 'true'}
            aria-describedby='pwdnote'
            ref={passwordInputFieldRef}
            onClick={() => focus()}
            onChange={(event) => setRegistry({ ...registry, passwordRegistryCheck: event.target.value })}
          />
          <button
            className='passwordLabel__visibility'
            aria-label='Toggle password visibility'
            onClick={(e) => {
              e.preventDefault();
              setRegistry({ ...registry, passwordVisible: registry.passwordVisible ? false : true });
            }}
          >
            {registry.passwordVisible ? (
              <svg xmlns='http://www.w3.org/2000/svg' width='1.2em' height='1.2em' viewBox='0 0 14 14'>
                <g fill='none' stroke='hsl(0, 0%, 20%)' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M13.23 6.33a1 1 0 0 1 0 1.34C12.18 8.8 9.79 11 7 11S1.82 8.8.77 7.67a1 1 0 0 1 0-1.34C1.82 5.2 4.21 3 7 3s5.18 2.2 6.23 3.33Z'></path>
                  <circle cx='7' cy='7' r='2'></circle>
                </g>
              </svg>
            ) : (
              <svg xmlns='http://www.w3.org/2000/svg' width='1.2em' height='1.2em' viewBox='0 0 14 14'>
                <g fill='none' stroke='hsl(0, 0%, 20%)' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M12.29 5.4c.38.34.7.67.94.93a1 1 0 0 1 0 1.34C12.18 8.8 9.79 11 7 11h-.4m-2.73-.87a12.4 12.4 0 0 1-3.1-2.46a1 1 0 0 1 0-1.34C1.82 5.2 4.21 3 7 3a6.56 6.56 0 0 1 3.13.87M12.5 1.5l-11 11'></path>
                  <path d='M5.59 8.41A2 2 0 0 1 5 7a2 2 0 0 1 2-2a2 2 0 0 1 1.41.59M8.74 8a2 2 0 0 1-.74.73'></path>
                </g>
              </svg>
            )}
          </button>
        </label>
        {registry.passwordRegistry !== registry.passwordRegistryCheck && registry.passwordRegistry.length > 3 ? (
          <figure className='inputFieldErrorMessage'>
            <figcaption>Error Message</figcaption>
            <p>Passwords do not match.</p>
          </figure>
        ) : null}
      </fieldset>
      <div className='ecoModal__container__buttons'>
        <button aria-label='Submit form' type='submit' onClick={() => SubmitEvent}>
          Submit
        </button>
        <button aria-label='Return to account login' onClick={() => setUiModal('userLogin')}>
          Return to Login
        </button>
        <button aria-label='Clear form input values' onClick={() => clearFormInputValues()}>
          Clear Form
        </button>
      </div>
      <div className='ecoModal__container__passkeys'>
        <button aria-label='Sign in with Google'>
          <Google />
        </button>
        <button aria-label='Sign in with LinkedIn'>
          <LinkedIn />
        </button>
        <button aria-label='Sign in with Apple'>
          <Apple />
        </button>
      </div>
      <div className='ecoModal__container__notice'>
        <p>This form validates input fields and aims to simulate user authentication via localStorage.</p>
      </div>
    </form>
  );
};

export default UserAccountRegistry;
