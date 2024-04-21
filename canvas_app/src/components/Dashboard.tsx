import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../scss/partials/_dashboard.scss';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: location.origin,
});

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    client
      .get(`/api/user/`)
      .then((e) => {
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
      .catch((e) => {
        console.log('123', e);
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

  const CanvasHandler = (slug: any) => {
    navigate(`/canvas/${slug}`);
  };

  return (
    <div>
      <h1 className='title'>Dashboard</h1>
      <form onSubmit={(e) => submitLogout(e)}>
        <button className='logout-button' type='submit'>
          Log out
        </button>
      </form>
      <div className='cards-container'>
        {canvases.map((item: any) => (
          <div
            key={item.id}
            className='card'
            onClick={() => CanvasHandler(item.slug)}
          >
            <div className='image-container'>
              <img src={item.image} alt={item.title} className='card-image' />
            </div>
            <div className='card-title'>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
