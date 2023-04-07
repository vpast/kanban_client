import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const registerHandler = (event) => {
    event.preventDefault();
    var registerData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    
    if (registerData.email === '' || registerData.password === '') {
      document.getElementById('isFieldEmpty').style.display = 'block'
      return
    } else {
      document.getElementById('isFieldEmpty').style.display = 'none'
      fetch('http://localhost:5000/users', {
        method: 'POST',
        body: JSON.stringify(registerData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json())
      .then((data) => console.log(data));
      // navigate('/')
    }

  };

  return (
    <>
      <div className='loginPosition'>
        <form onSubmit={registerHandler} className='loginForm' id='registerForm'>
          <input type='email' name='email' placeholder='email'></input>
          <input type='password' name='password' placeholder='password'></input>
          <input type='submit' value='Register'></input>
          <p className='isFieldEmpty' id='isFieldEmpty'>Fill all field's please.</p>
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
