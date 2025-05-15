import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const Auth = () => {
  const navigate = useNavigate();

  const loginHandler = (event) => {
    event.preventDefault();
    var data = new FormData(event.target);

    var email = data.get('email').trim();
    var password = data.get('password').trim();
    console.log(email, password);
    var loginData = {
      email: email,
      password: password,
    };

    if (loginData.email !== '' || loginData.password !== '') {
      fetch(`${API_URL}/users/login`, {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (response.status === 200) {
          console.log(response.status);
          navigate('/board')
        }
      });
    }
    // console.log(loginData.email, loginData.password);
  };

  return (
    <>
      <div className='loginPosition'>
        <form onSubmit={loginHandler} className='loginForm'>
          <input
            type='email'
            name='email'
            placeholder='email'
            required
            pattern='^\S+@\S+\.\S+$'
          ></input>
          <input
            type='password'
            name='password'
            placeholder='password'
            required
            pattern='^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
          ></input>
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
