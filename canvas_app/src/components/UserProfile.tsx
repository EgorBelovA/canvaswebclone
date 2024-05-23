import { useLayoutEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../scss/components/user-profile.scss';
import DashboardHeader from './DashboardHeader';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: location.origin,
});

const UserProfile = () => {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<any>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const cropAreaRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  useLayoutEffect(() => {
    client
      .get(`/api/user/`)
      .then((e) => {
        setUserData(e.data.user);
        setUsername(e.data.user.first_name);
        console.log(e.data.user);
      })
      .catch((_) => {
        navigate('/login/');
      });
  }, []);

  const [imageFile, setImageFile] = useState<any>(null);
  const [cropArea, setCropArea] = useState({
    x: 100,
    y: 100,
    width: 100,
    height: 100,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modalActive, setModalActive] = useState(false);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image() as HTMLImageElement;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = canvasRef.current;
        canvas!.width = img.width;
        canvas!.height = img.height;

        modalBodyRef!.current!.style.width = `${img.width}px`;
        modalBodyRef!.current!.style.height = `${img.height}px`;

        const ctx = canvas!.getContext('2d');
        ctx!.drawImage(img, 0, 0, img.width, img.height);
        ctx!.restore();
      };
      img.src = reader.result as string;
      setImageFile(img);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    const canvas = canvasRef.current;
    const ctx = canvas!.getContext('2d');
    const croppedImage = new Image();

    canvas!.width = Math.abs(cropArea.width);
    canvas!.height = Math.abs(cropArea.height);
    ctx!.fillStyle = 'white';
    ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
    ctx!.drawImage(
      imageFile,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      canvas!.width,
      canvas!.height
    );

    const dataURL = canvas!.toDataURL();
    croppedImage.src = dataURL;
    croppedImage.onload = () => {
      canvas!.toBlob(async (blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append('avatar', blob);
          client
            .patch(`/api/user/${userData.id}/`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }, 'image/png');
    };
  };

  let diffX = 0;
  let diffY = 0;
  const handleMouseDownGeneral = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).className !== 'crop-area') return;
    const rect = cropAreaRef!.current!.getBoundingClientRect();
    diffX =
      e.clientX -
      rect.left +
      modalBodyRef!.current!.offsetLeft -
      window.scrollX;
    diffY =
      e.clientY - rect.top + modalBodyRef!.current!.offsetTop - window.scrollY;

    window.addEventListener('mousemove', handleMouseMoveGeneral);
    window.addEventListener('mouseup', handleMouseUpGeneral);
  };

  const handleMouseMoveGeneral = (e: any) => {
    const x = e.clientX - diffX;
    const y = e.clientY - diffY;
    //check borders
    cropAreaRef!.current!.style.left = `${x}px`;
    cropAreaRef!.current!.style.top = `${y}px`;
  };

  const handleMouseUpGeneral = () => {
    setCropArea({
      x: cropAreaRef!.current!.offsetLeft,
      y: cropAreaRef!.current!.offsetTop,
      width: cropAreaRef!.current!.offsetWidth,
      height: cropAreaRef!.current!.offsetHeight,
    });
    window.removeEventListener('mousemove', handleMouseMoveGeneral);
    window.removeEventListener('mouseup', handleMouseUpGeneral);
  };

  const handleMouseDown = (corner: any) => {
    window.addEventListener('mouseup', handleMouseUp);
    switch (corner) {
      case 'ne':
        window.addEventListener('mousemove', handleMouseMoveNE);
        break;
      case 'nw':
        window.addEventListener('mousemove', handleMouseMoveNW);
        break;
      case 'sw':
        window.addEventListener('mousemove', handleMouseMoveSW);
        break;
      case 'se':
        window.addEventListener('mousemove', handleMouseMoveSE);
        break;
      default:
        break;
    }

    // window.removeEventListener('mousedown', handleMouseMoveGeneral);
    // window.removeEventListener('mouseup', handleMouseUpGeneral);
  };

  const handleMouseMoveNE = (e: MouseEvent) => {
    const rect = canvasRef!.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let y = e.clientY - rect.top < 0 ? 0 : e.clientY - rect.top;

    const width =
      x > canvasRef!.current!.width
        ? canvasRef!.current!.width - cropAreaRef.current!.offsetLeft
        : x - cropAreaRef.current!.offsetLeft;
    const height =
      cropAreaRef.current!.offsetTop + cropAreaRef.current!.offsetHeight - y;
    cropAreaRef.current!.offsetTop + cropAreaRef.current!.offsetHeight - y;

    // let height =
    //   cropAreaRef.current!.offsetTop + cropAreaRef.current!.offsetHeight - y;
    // if (y ) {
    //   cropAreaRef!.current!.style.top = `${y}px`;
    //   console.log(123);
    // }

    cropAreaRef!.current!.style.width = `${width}px`;
    cropAreaRef!.current!.style.height = `${height}px`;
    cropAreaRef!.current!.style.top = `${y}px`;
  };

  const handleMouseMoveNW = (e: MouseEvent) => {
    const rect = canvasRef!.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width =
      cropAreaRef.current!.offsetLeft + cropAreaRef.current!.offsetWidth - x;
    const height =
      cropAreaRef.current!.offsetTop + cropAreaRef.current!.offsetHeight - y;

    cropAreaRef!.current!.style.width = `${width}px`;
    cropAreaRef!.current!.style.height = `${height}px`;
    cropAreaRef!.current!.style.top = `${y}px`;
    cropAreaRef!.current!.style.left = `${x}px`;
  };

  const handleMouseMoveSW = (e: MouseEvent) => {
    const rect = canvasRef!.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width =
      cropAreaRef.current!.offsetLeft + cropAreaRef.current!.offsetWidth - x;
    const height = y - cropAreaRef.current!.offsetTop;

    console.log(width);

    cropAreaRef!.current!.style.width = `${width}px`;
    cropAreaRef!.current!.style.height = `${height}px`;
    cropAreaRef!.current!.style.left = `${x}px`;
  };

  const handleMouseMoveSE = (e: MouseEvent) => {
    const rect = canvasRef!.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let width = x - cropAreaRef.current!.offsetLeft;
    const height = y - cropAreaRef.current!.offsetTop;

    cropAreaRef!.current!.style.width = `${width}px`;
    cropAreaRef!.current!.style.height = `${height}px`;
  };

  const handleMouseUp = () => {
    setCropArea({
      x: cropAreaRef!.current!.offsetLeft,
      y: cropAreaRef!.current!.offsetTop,
      width: cropAreaRef!.current!.offsetWidth,
      height: cropAreaRef!.current!.offsetHeight,
    });

    window.removeEventListener('mousemove', handleMouseMoveNE);
    window.removeEventListener('mousemove', handleMouseMoveNW);
    window.removeEventListener('mousemove', handleMouseMoveSW);
    window.removeEventListener('mousemove', handleMouseMoveSE);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div>
      <form className='user-profile'>
        <DashboardHeader userData={userData} />
        <input readOnly value={userData.email} />
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <div className='user-avatar'>
          <input
            style={{ display: 'none' }}
            // id='avatar-uploader'
            ref={fileRef}
            type='file'
            onChange={handleImageUpload}
            accept='image/*'
          />
          <div
            // htmlFor='avatar-uploader'
            style={{
              color: '#fff',
              fontFamily: 'Breath_Demo',
              cursor: 'pointer',
            }}
            className='edit-button'
            onClick={() => {
              fileRef.current?.click();
              setModalActive(true);
            }}
          >
            Edit
          </div>
        </div>
        {/* <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        /> */}
      </form>
      {modalActive && (
        <div
          className='modal'
          style={{ color: '#fff', fontFamily: 'Breath_Demo' }}
        >
          <div className='modal-content'>
            <div className='modal-header'>
              <h3 onClick={handleCrop} style={{ cursor: 'pointer' }}>
                Crop image
              </h3>
              <button className='modal-close'>&times;</button>
            </div>
            <div
              className='modal-body'
              ref={modalBodyRef}
              style={{
                position: 'relative',
                backgroundColor: '#fff',
                overflow: 'hidden',
              }}
            >
              <canvas ref={canvasRef} style={{ position: 'relative' }} />
              <div
                onMouseDown={handleMouseDownGeneral}
                className='crop-area'
                ref={cropAreaRef}
                style={{
                  //   display: isCropping ? 'block' : 'none',
                  position: 'absolute',
                  left: 100,
                  top: 100,
                  width: 100,
                  height: 100,

                  //   width: '100px',
                  //   height: '100px',
                  //   pointerEvents: 'none',
                  zIndex: 9999,
                  cursor: 'move',
                  //   overflow: 'hidden',
                }}
              >
                <div
                  className='resize-handle-nesw-top'
                  onMouseDown={() => handleMouseDown('ne')}
                ></div>
                <div
                  onMouseDown={() => handleMouseDown('nw')}
                  className='resize-handle-nwse-top'
                ></div>
                <div
                  onMouseDown={() => handleMouseDown('sw')}
                  className='resize-handle-nesw-bottom'
                ></div>
                <div
                  onMouseDown={() => handleMouseDown('se')}
                  className='resize-handle-nwse-bottom'
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
