import {useNavigate} from 'react-router-dom'

const Auth = () => {
  const navigate = useNavigate();

  const loginHandler = (event) => {
    event.preventDefault();

    var loginData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    if (loginData.email === '' || loginData.password === '') {
      document.getElementById('isFieldEmpty').style.display = 'block'
    } else {
      document.getElementById('isFieldEmpty').style.display = 'none'
      
      fetch('http://localhost:5000/users/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.json())
      .then((data) => console.log(data));
      // navigate('/board')
    }
    
    // console.log(loginData.email, loginData.password);
  };
  
  return (
    <>
      <div className='loginPosition'>
        <form onSubmit={loginHandler} className='loginForm'>
          <input type='email' name='email' placeholder='email'></input>
          <input type='password' name='password' placeholder='password'></input>
          <input type='submit' value='Login'></input>
          <p className='isFieldEmpty' id='isFieldEmpty'>Fill all field's please.</p>
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
