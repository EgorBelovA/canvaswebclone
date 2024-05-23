import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../scss/components/user_form.scss';
import { useNavigate } from 'react-router-dom';
// import BackgroundButterflies from './BackgroundButterflies';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: location.origin,
});

const Login = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailFieldRef = useRef<HTMLInputElement>(null);
  const passwordFieldRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (emailFieldRef.current) {
      emailFieldRef.current.focus();
    }
  }, []);

  // const handleAutoFill = () => {
  //   console.log(123);
  //   registerUser();
  // };
  // useEffect(() => {
  //   const formElement = passwordFieldRef.current;
  //   if (formElement) {
  //     formElement.addEventListener('autocomplete', handleAutoFill);
  //     return () => {
  //       formElement.removeEventListener('autocomplete', handleAutoFill);
  //     };
  //   }
  // }, []);

  const registerUser = () => {
    if (password === '') {
      setErrors(['Please enter a password.']);
      return;
    }
    if (email === '') {
      setErrors(['Please enter an email.']);
      return;
    }
    client
      .post('/api/login/', {
        email: email,
        password: password,
      })
      .then(async function (e) {
        console.log(e);
        // const { data } = await client.post('/api/token/', {
        //   email: email,
        //   password: password,
        // });
        // localStorage.clear();
        // localStorage.setItem('access_token', data.access);
        // localStorage.setItem('refresh_token', data.refresh);
        // axios.defaults.headers.common[
        //   'Authorization'
        // ] = `Bearer ${data['access']}`;
        navigate('/dashboard/');
      })
      .catch(function (error) {
        console.log(error);
        setErrors(['Invalid credentials.']);
      });
  };

  return (
    <div className='page_container'>
      <head>
        <title>Login - Canvas</title>
      </head>
      {/* <BackgroundButterflies
        numberOfButterflies={50}
        styleClassName='butterfly-background'
        fileName='/static/icons/butterfly_BG.svg'
      /> */}
      <div className='login-container'>
        <form onSubmit={(e) => e.preventDefault()} ref={formRef}>
          <div className='form-input'>
            <input
              ref={emailFieldRef}
              type='text'
              name='email'
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor='email' title='Email' data-title='Email' />
          </div>
          <div className='form-input'>
            <input
              ref={passwordFieldRef}
              type='password'
              name='password'
              id='password'
              autoComplete='on'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor='password' title='Password' data-title='Password' />
            {errors.length > 0 && (
              <div className='error-message-container'>
                {errors.map((error) => (
                  <div className='error-message'>{error}</div>
                ))}
              </div>
            )}
          </div>
          <button
            type='submit'
            className='next_button controls'
            onClick={registerUser}
          >
            Log In
          </button>
          <div id='OR_div'>
            <span id='OR'>OR</span>
          </div>
          <a
            className='next_button controls google_link socialaccount_provider google'
            title='Google'
            href={`${location.origin}/api/google/login/`}
          >
            <object
              style={{ pointerEvents: 'none' }}
              type='image/svg+xml'
              data='/static/icons/google_logo.svg'
              width='24px'
            />
            Continue with Google
          </a>
          Already have an account?&nbsp;
          <a
            id='signup_login'
            className='controls'
            href={`${location.origin}/signup/`}
          >
            Sign Up
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;
