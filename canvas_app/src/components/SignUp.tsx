import { useState, useEffect } from 'react';
import axios from 'axios';
import '../scss/partials/user_form.scss';
import { useNavigate } from 'react-router-dom';
// import G from './google_logo.svg';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: location.origin,
});

const SignUp = () => {
  const [currentUser, setCurrentUser] = useState<any>();
  const [name, setName] = useState<string>('');
  //   const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); //   const [error, setError] = useState('');
  //   const registerUser = async () => {
  //     try {
  //       await client.post('/api/signup/', {
  //         name: name,
  //         email: email,
  //         password: password,
  //       });
  //       setError('');
  //     } catch (err: any) {
  //       setError(err.response.data.message);
  //     }
  //   };

  useEffect(() => {
    client
      .get('/api/user/')
      .then(function (e) {
        setEmail(e.data.email);
        setCurrentUser(true);
      })
      .catch(function () {
        setCurrentUser(false);
      });
  }, []);

  const registerUser = () => {
    console.log(currentUser);
    client
      .post('/api/signup/', {
        first_name: name,
        email: email,
        password: password,
      })
      .then(function () {
        setCurrentUser(true);
        navigate('/email-verification/');
      });
  };

  //   const google_link =
  //     'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&response_type=code&state=api&redirect_uri=http://127.0.0.1:8001/api/google/callback&include_granted_scopes=true&client_id=274441604369-cv480ffap251aptbhfc9jj320okprcun.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/userinfo.email&https://www.googleapis.com/auth/userinfo.profile&openid';

  //   const GoogleRegister = () => {
  //     client.get(google_link).then((e) => {
  //       console.log(e);
  //     });
  //   };

  return (
    <div className='page_container'>
      <head>
        <title>Sign Up | Canvas</title>
      </head>

      <form id='offset registration_form' onSubmit={(e) => e.preventDefault()}>
        <fieldset className='form'>
          <legend className='form-label'>Username</legend>
          <div className='form-input'>
            <input
              type='text'
              name='name'
              className='register__textBox'
              value={name}
              required
              autoComplete='off'
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter username'
            />
          </div>
          <div className='form-error'></div>
        </fieldset>
        <fieldset className='form'>
          <legend className='form-label'>Email address</legend>
          <div className='form-input'>
            <input
              type='email'
              name='email'
              className='register__textBox'
              value={email}
              required
              autoComplete='off'
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
              autoComplete='new-password'
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
          href={`${location.origin}/login/`}
        >
          Log In
        </a>
      </form>
    </div>
  );
};

export default SignUp;
