import {useNavigate} from 'react-router-dom'

const Auth = () => {
  const navigate = useNavigate();

  const loginHandler = (event) => {
    event.preventDefault();
    if (event.target.email.value === '' || event.target.password.value === '') {
      document.getElementById('isFieldEmpty').style.display = 'block'
    } else {
      document.getElementById('isFieldEmpty').style.display = 'none'
    }
    
    // navigate('/board')
    // console.log(event.target.email.value, event.target.password.value);
  };
  
  return (
    <>
      <div className='loginPosition'>
        <form onSubmit={loginHandler} className='loginForm'>
          <input type='email' name='email' placeholder='email'></input>
          <input type='password' name='password' placeholder='password'></input>
          <p className='isFieldEmpty' id='isFieldEmpty'>Fill all field's please.</p>
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
