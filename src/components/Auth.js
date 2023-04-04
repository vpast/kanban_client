import {useNavigate} from 'react-router-dom'

const Auth = () => {
  const navigate = useNavigate();

  const loginHandler = (event) => {
    event.preventDefault();
    // window.location.href = '/board';
    navigate('/board')
    console.log(event.target.email.value, event.target.password.value);
  };
  
  return (
    <>
      <div className='loginPosition'>
        <form onSubmit={loginHandler} className='loginForm'>
          <input type='email' name='email' placeholder='email'></input>
          <input type='password' name='password' placeholder='password'></input>
          <input type='submit' value='Login'></input>
          <p>
            Not registered?{' '}
            <a href='/register' className='link'>
              Click here!
            </a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Auth;
