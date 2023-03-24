const Register = () => {
  const registerHandler = (event) => {
    event.preventDefault();
    var registerData = {
      'email': event.target.email.value,
      'password': event.target.password.value,
    };
    console.log(registerData)
    window.location.href = '/';

    fetch('http://localhost:5000/users', {
      method: 'POST',
      body: JSON.stringify(registerData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <>
      <div className='loginPosition'>
        <form onSubmit={registerHandler} className='loginForm'>
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
