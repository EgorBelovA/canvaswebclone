import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import '../scss/components/dashboard.scss';
import DashboardHeader from './DashboardHeader';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: location.origin,
});

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>({});

  useLayoutEffect(() => {
    client
      .get(`/api/user/`)
      .then((e) => {
        setUserData(e.data.user);
        console.log(e.data.user);
        client
          .post('/api/token/', {
            email: e.data.user.email,
          })
          .then((e) => {
            localStorage.clear();
            localStorage.setItem('access_token', e.data.access);
            localStorage.setItem('refresh_token', e.data.refresh);
            // axios.defaults.headers.common[
            //   'Authorization'
            // ] = `Bearer ${data['access']}`;
          });
      })
      .catch((_) => {
        navigate('/login/');
      });
  }, []);

  function submitLogout(e: any) {
    e.preventDefault();
    client.post('/api/logout/').then(function () {
      localStorage.clear();
      navigate('/login/');
    });
  }

  const [canvases, setCanvases] = useState([]);

  useEffect(() => {
    client.get('api/canvas/').then((res: any) => {
      setCanvases(res.data);
    });
  }, []);

  // const CanvasHandler = (e: any, slug: any) => {
  //   console.log(e);
  //   e.href = '/canvas/' + slug;
  //   // navigate(`/canvas/${slug}`, { replace: true });
  // };

  return (
    <div>
      <DashboardHeader avatar={userData.avatar} />
      <div>
        <h1 className='title'>{userData.first_name}</h1>
        <h2 className='title'>{userData.email}</h2>
      </div>
      <div>
        <form onSubmit={(e) => submitLogout(e)}>
          <button className='logout-button' type='submit'>
            Log out
          </button>
        </form>
      </div>
      <div className='cards-container'>
        {canvases.map((item: any) => (
          <a key={item.id} className='card' href={'/canvas/' + item.slug}>
            <div className='image-container'>
              <img src={item.image} alt={item.title} className='card-image' />
            </div>
            <div className='card-title'>{item.title}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
