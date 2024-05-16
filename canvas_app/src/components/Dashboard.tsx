import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState, useRef } from 'react';
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
  const [isModalCanvasForm, setIsModalCanvasForm] = useState<boolean>(false);

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

  function submitLogout() {
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

  const titleRef = useRef<HTMLInputElement>(null);

  const handleCanvasModal = () => {
    setIsModalCanvasForm(true);
  };

  const handleCanvasCreate = (e: any) => {
    e.preventDefault();
    client.post('/api/canvas/create/new/', {
      title: titleRef.current!.value,
    });
  };

  return (
    <div>
      <DashboardHeader avatar={userData.avatar} />
      <div>
        <h1 className='title'>{userData.first_name}</h1>
        <h2 className='title'>{userData.email}</h2>
      </div>
      <div>
        <div className='logout-button' onSubmit={submitLogout}>
          Log out
        </div>
        <button
          onClick={handleCanvasModal}
          type='button'
          className='create-button'
        >
          New canvas
        </button>
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
      {isModalCanvasForm && (
        <div className='modal-canvas-form'>
          <div className='modal-canvas-form-header'>
            <div className='modal-canvas-title'>Canvas Form</div>
            <div
              className='modal-close-button'
              onClick={() => setIsModalCanvasForm(false)}
            >
              X
            </div>
          </div>
          <div className='modal-canvas-form-body'>
            <form>
              <div className='form-group'>
                <label htmlFor='title'>Title</label>
                <input
                  ref={titleRef}
                  type='text'
                  className='form-control'
                  id='title'
                  placeholder='Enter title'
                />
              </div>
              <div className='form-group'>
                <label htmlFor='image'>Image</label>
                <input
                  type='file'
                  className='form-control'
                  id='image'
                  placeholder='Enter image'
                />
              </div>
              <button
                type='button'
                className='btn btn-primary'
                onClick={handleCanvasCreate}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
