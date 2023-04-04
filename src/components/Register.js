import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const registerHandler = (event) => {
    event.preventDefault();
    var registerData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    // var form = document.getElementById('registerForm')

    // const payload = new FormData(form)
    // console.log(payload);
    navigate('/')

    fetch('http://localhost:5000/users', {
      method: 'POST',
      body: JSON.stringify(registerData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    // fetch('http://localhost:5000/post', {
    //   method: 'POST',
    //   body: payload,
    // })
    //   .then((res) => res.json())
    //   .then((data) => console.log(data));
  };

  return (
    <>
      <div className='loginPosition'>
        <form onSubmit={registerHandler} className='loginForm' id='registerForm'>
          <input type='email' name='email' placeholder='email'></input>
          <input type='password' name='password' placeholder='password'></input>
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
