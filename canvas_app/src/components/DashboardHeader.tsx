import '../scss/components/dashboard.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import Notifications from './Notifications';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: location.origin,
});

const DashboardHeader = (props: any) => {
  const navigate = useNavigate();
  const [isModalFormProfile, setIsModalFormProfile] = useState(false);
  const [isMouseOverProfile, setIsMouseOverProfile] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const submitLogout = (e: any) => {
    e.preventDefault();
    client.post('/api/logout/').then(function () {
      localStorage.clear();
      navigate('/login/');
    });
  };

  useEffect(() => {
    const handleClick = (e: any) => {
      if (!profileRef.current?.contains(e.target)) {
        setIsModalFormProfile(false);
      }
    };
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [isModalFormProfile]);

  return (
    <div className='dashboard-container-header'>
      <div className='dashboard-header-logo'>
        <object
          className='logo'
          type='image/svg+xml'
          data='/static/icons/logo_wings.svg'
        />
      </div>
      <div className='dashboard-header-right'>
        <div className='dashboard-header-notifications'>
          <Notifications userData={props.userData} />
        </div>
        <div
          ref={profileRef}
          className='dashboard-header-user-avatar'
          onMouseOver={() => setIsMouseOverProfile(true)}
          onMouseOut={() => setIsMouseOverProfile(false)}
          onClick={() => setIsModalFormProfile(!isModalFormProfile)}
        >
          <img
            src={props.userData.avatar}
            alt='user'
            className='dashboard-header-user-img'
          />
          {isMouseOverProfile && !isModalFormProfile && (
            <div className='mouse-over-profile'>
              {props.userData.first_name}
            </div>
          )}
          {isModalFormProfile && (
            <div className='modal-form-profile'>
              <li className='profile-button'>
                <a href='/profile/'>Profile</a>
              </li>
              <li className='profile-button'>
                <a href='/dashboard/'>Dashboard</a>
              </li>
              <li className='profile-button'>
                <a href='/premium/'>Upgrade to Premium</a>
              </li>
              <li className='profile-button'>
                <a onClick={submitLogout}>Log out</a>
              </li>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DashboardHeader;
