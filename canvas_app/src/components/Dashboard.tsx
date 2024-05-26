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
      })
      .catch((_) => {
        navigate('/login/');
      });
  }, []);

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
  const backgroundDarkRef = useRef<HTMLDivElement>(null);

  const handleCanvasModal = () => {
    backgroundDarkRef.current!.classList.add('active');
    document.body.style.overflow = 'hidden';
    scrollTo(0, 0);
    setIsModalCanvasForm(true);
  };

  const handleCanvasCreate = () => {
    client.post('/api/canvas/create/new/', {
      title: titleRef.current!.value,
    });

    window.location.reload();
  };

  const [buttonText, setButtonText] = useState('New Canvas');

  useLayoutEffect(() => {
    const handleTextChange = () => {
      if (window.innerWidth < 1000) {
        setButtonText('+');
      } else {
        setButtonText('New Canvas');
      }
    };
    window.addEventListener('resize', handleTextChange);
    handleTextChange();
    return () => {
      window.removeEventListener('resize', handleTextChange);
    };
  }, [buttonText]);

  return (
    <div>
      <DashboardHeader userData={userData} />
      <div ref={backgroundDarkRef} className='background-dark'></div>
      <div className='cards-container'>
        {canvases.reverse().map((item: any) => (
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
              onClick={() => {
                setIsModalCanvasForm(false);
                backgroundDarkRef.current!.classList.remove('active');
                document.body.style.overflow = 'auto';
              }}
            >
              X
            </div>
          </div>
          <div className='modal-canvas-form-body'>
            <form>
              <div className='form-group'>
                <input
                  ref={titleRef}
                  type='text'
                  className='form-control'
                  id='title'
                  placeholder='Enter title'
                />
              </div>
              {/* <div className='form-group'>
                <label htmlFor='image'>Image</label>
                <input
                  type='file'
                  className='form-control'
                  id='image'
                  placeholder='Enter image'
                />
              </div> */}
              <button
                type='button'
                className='modal-canvas-form-submit-button'
                onClick={handleCanvasCreate}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      <div className='create-button-container'>
        <button
          onClick={handleCanvasModal}
          type='button'
          className='create-button'
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
