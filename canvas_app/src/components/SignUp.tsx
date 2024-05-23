import { useState, useEffect, useLayoutEffect, useRef } from 'react';
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

const SignUp = () => {
  const emailFieldRef = useRef<HTMLInputElement>(null);
  const passwordFieldRef = useRef<HTMLInputElement>(null);
  const usernameFieldRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const emojuClosedEyesRef = useRef<any>(null);
  const [name, setName] = useState<string>('');
  //   const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [stepCount, setStepCount] = useState(0);

  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--step-count', `${stepCount}`);
  }, [stepCount]);

  const navigate = useNavigate();

  const handleEmailCheck = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      client
        .get('/api/email/check/', {
          params: {
            email: email,
          },
        })
        .then((e) => {
          if (e.data.exists) {
            setEmailErrors(['Email already exists.']);
            emailFieldRef.current?.focus();
          } else {
            setStepCount(-1);
            setEmailErrors([]);
            emailFieldRef.current?.blur();
            setTimeout(() => {
              passwordFieldRef.current?.focus();
            }, 400);
          }
        });
    } else {
      setEmailErrors(['Please enter a valid email address.']);
      emailFieldRef.current?.focus();
    }
  };

  const registerUser = () => {
    client
      .post('/api/signup/', {
        first_name: name,
        email: email,
        password: password,
      })
      .then(function () {
        navigate('/email-verification/');
      });
  };

  const [frame, setFrame] = useState<any>();

  const handlePasswordCheck = () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+!=?*-/]).{8,20}$/;

    if (password.length < 8) {
      setPasswordErrors(['Password must be at least 8 characters.']);
      return;
    }

    if (password.search(/[A-Z]/) < 0) {
      setPasswordErrors([
        'Password must contain at least one uppercase letter.',
      ]);
      return;
    }

    if (password.search(/[a-z]/) < 0) {
      setPasswordErrors([
        'Password must contain at least one lowercase letter.',
      ]);
      return;
    }

    if (password.search(/[0-9]/) < 0) {
      setPasswordErrors(['Password must contain at least one number.']);
      return;
    }

    if (password.search(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) < 0) {
      setPasswordErrors([
        'Password must contain at least one special character.',
      ]);
      return;
    }

    if (passwordRegex) {
      setStepCount(-2);
      setPasswordErrors([]);
      passwordFieldRef.current?.blur();
      setTimeout(() => {
        usernameFieldRef.current?.focus();
      }, 400);
    }
  };

  useEffect(() => {
    emailFieldRef!.current!.onkeydown = (e) => {
      if (e.key === 'Enter') {
        handleEmailCheck();
        return false;
      }
    };

    passwordFieldRef!.current!.onkeydown = (e) => {
      if (e.key === 'Enter') {
        handlePasswordCheck();
        return false;
      }
    };
  });

  const handlePenClick = () => {
    setStepCount(0);
    setTimeout(() => {
      emailFieldRef.current?.focus();
    }, 400);
  };

  const handlePasswordInput = (e: any) => {
    setPassword(e.target.value);
    switch (e.target.value.length) {
      case 0:
        setFrame(65);
        break;
      case 1:
        setFrame(70);
        break;
      case 2:
        setFrame(75);
        break;
      case 3:
        setFrame(80);
        break;
      case 4:
        setFrame(90);
        break;
      case 5:
        setFrame(95);
        break;
      case 6:
        setFrame(100);
        break;
      case 7:
        setFrame(105);
        break;
      case 8:
        setFrame(110);
        break;
      case 9:
        setFrame(115);
        break;
      case 10:
        setFrame(120);
        break;
      case 11:
        setFrame(125);
        break;
      case 12:
        setFrame(130);
        break;
      case 13:
        setFrame(135);
        break;
      case 14:
        setFrame(140);
        break;
      case 15:
        setFrame(145);
        break;
      case 16:
        setFrame(150);
        break;
      case 17:
        setFrame(155);
        break;
      case 18:
        setFrame(160);
        break;
      case 19:
        setFrame(165);
        break;
      case 20:
        setFrame(170);
        break;
    }
    if (e.target.value.length === 0) {
      emojuClosedEyesRef.current.classList.add('hidden');
    } else {
      emojuClosedEyesRef.current.classList.remove('hidden');
    }
  };

  useEffect(() => {
    emojuClosedEyesRef.current.currentTime = 2;
    if (
      emojuClosedEyesRef.current &&
      isFinite(emojuClosedEyesRef.current.duration) &&
      emojuClosedEyesRef.current.duration > 0 &&
      emojuClosedEyesRef.current.currentTime
    ) {
      emojuClosedEyesRef.current.currentTime = frame / 100;
      emojuClosedEyesRef.current.play();

      const playPromise = emojuClosedEyesRef!.current!.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          emojuClosedEyesRef.current.pause();
        });
      }
    }
  }, [frame]);

  return (
    <div className='page_container'>
      <head>
        <title>Sign Up - Canvas</title>
      </head>
      {/* <BackgroundButterflies
        numberOfButterflies={50}
        styleClassName='butterfly-background'
        fileName='/static/icons/butterfly_BG.svg'
      /> */}

      <form id='registration_form' onSubmit={(e) => e.preventDefault()}>
        <div className='step1'>
          <div className='form-input'>
            <input
              ref={emailFieldRef}
              type='text'
              name='email'
              value={email}
              autoFocus
              required
              autoComplete='off'
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor='email' title='Email' data-title='Email' />
            {emailErrors.length > 0 && (
              <div className='error-message-container'>
                {emailErrors.map((e) => (
                  <div key={e} className='error-message'>
                    {e}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div id='fieldset_focus'></div>
          <div className='next_button controls' onClick={handleEmailCheck}>
            Next
          </div>
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
        </div>
        <div className='step2'>
          <div className='emoji-container'>
            <video
              className='emoji'
              autoPlay={true}
              preload='auto'
              loop={true}
              muted={true}
              disablePictureInPicture={true}
              webkit-playsinline={true}
              playsInline={true}
              controls={false}
            >
              <source src='/static/20_Hugging_Face.mp4' type='video/mp4' />
            </video>
            <video
              className='emoji hidden'
              preload='auto'
              muted={true}
              disablePictureInPicture={true}
              webkit-playsinline={true}
              playsInline={true}
              controls={false}
              ref={emojuClosedEyesRef}
            >
              <source
                src='/static/18_Blushing_Closed_eyes.mp4'
                type='video/mp4'
              />
            </video>
          </div>
          <div className='email-confirmation-wrapper'>
            <div className='email-confirmation-container'>
              <div className='email-confirmation-text'>{email}</div>
              <div className='pen-icon-container' onClick={handlePenClick}>
                <object
                  className='pen-icon'
                  type='image/svg+xml'
                  data='/static/icons/pen.svg'
                />
              </div>
            </div>
          </div>
          <div className='form-input'>
            <input
              ref={passwordFieldRef}
              type='password'
              name='password'
              value={password}
              onChange={handlePasswordInput}
              autoComplete='new-password'
              required
              // pattern='\d*'
              maxLength={20}
            />
            <label htmlFor='password' title='Password' data-title='Password' />
            {passwordErrors.length > 0 && (
              <div className='error-message-container'>
                {passwordErrors.map((e) => (
                  <div key={e} className='error-message'>
                    {e}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='next_button controls' onClick={handlePasswordCheck}>
            Next
          </div>
        </div>
        <div className='step3'>
          <div className='form-input'>
            <input
              ref={usernameFieldRef}
              type='text'
              name='name'
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor='name' title='Username' data-title='Username' />
          </div>
          <button
            ref={submitButtonRef}
            type='submit'
            className='next_button controls'
            onClick={registerUser}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
