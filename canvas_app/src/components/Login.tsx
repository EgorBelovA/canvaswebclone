import { useState, useEffect } from 'react';
import axios from 'axios';
import '../scss/partials/user_form.scss';
import { useNavigate } from 'react-router-dom';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: location.origin,
});

const Login = () => {
  const [currentUser, setCurrentUser] = useState<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    client
      .get('/api/user/')
      .then(function () {
        setCurrentUser(true);
      })
      .catch(function () {
        setCurrentUser(false);
      });
  }, []);

  const registerUser = () => {
    console.log(currentUser);
    client
      .post('/api/login/', {
        email: email,
        password: password,
      })
      .then(async function () {
        const { data } = await client.post('/api/token/', {
          email: email,
          password: password,
        });
        setCurrentUser(true);
        localStorage.clear();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        // axios.defaults.headers.common[
        //   'Authorization'
        // ] = `Bearer ${data['access']}`;
        navigate('/dashboard/');
      });
  };

  return (
    <div className='page_container'>
      <head>
        <title>Login | Canvas</title>
      </head>

      <form id='offset registration_form' onSubmit={(e) => e.preventDefault()}>
        <fieldset className='form'>
          <legend className='form-label'>Email address</legend>
          <div className='form-input'>
            <input
              type='email'
              name='email'
              className='register__textBox'
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter email-address'
            />
          </div>
          <div className='form-error'></div>
        </fieldset>
        <fieldset className='form'>
          <legend className='form-label'>Password</legend>
          <div className='form-input'>
            <input
              type='password'
              name='password'
              className='register__textBox'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Enter password'
            />
          </div>
          <div id='fieldset_focus'></div>
          <div className='form-error'></div>
        </fieldset>
        <button className='next_button controls' onClick={registerUser}>
          Next
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
  );
};

export default Login;
