import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const registerHandler = (event) => {
    event.preventDefault();
    var data = new FormData(event.target);

    var email = data.get('email').trim();
    var password = data.get('password').trim();

    var registerData = {
      email: email,
      password: password,
    };

    if (registerData.email !== '' || registerData.password !== '') {
      fetch('http://localhost:5000/users/register', {
        method: 'POST',
        body: JSON.stringify(registerData),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (response.status === 201) {
          console.log(response.status);
          navigate('/board')
        }
        if (response.status === 400) {
          alert('Email is already taken')
        }
      });
    }
  };

  return (
    <>
      <div className='loginPosition'>
        <form
          onSubmit={registerHandler}
          className='loginForm'
          id='registerForm'
        >
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
          <input type='submit' value='Register'></input>
          <p>
            Already registered?{' '}
            <a href='/' className='link'>
              Login!
            </a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
