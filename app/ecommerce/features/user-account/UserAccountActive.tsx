import type { Dispatch, SetStateAction } from 'react';

//Prop drill from UserAccountModal
type PropType = {
  setUiModal: Dispatch<SetStateAction<string>>;
};

const UserAccountActive = ({ setUiModal }: PropType) => {
  const firstName = localStorage.getItem('firstName');
  const userName = firstName ? JSON.parse(firstName) : null;

  return (
    <div className='ecoModal__container'>
      <legend>
        <h2>My Account</h2>
      </legend>
      <p>
        {userName
          ? `Hello, ${userName}, Thank you for testing my field validation/user authentication form simulation.`
          : null}
      </p>
      <div className='ecoModal__container__buttons'>
        <button
          aria-label='Log out of your account'
          onClick={() => {
            localStorage.setItem('userSignedIn', JSON.stringify(false));
            setUiModal('userLogin');
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default UserAccountActive;
