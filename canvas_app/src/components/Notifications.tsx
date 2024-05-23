import '../scss/components/dashboard.scss';
import axios from 'axios';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: location.origin,
});

const Notifications = (props: any) => {
  const [isMouseOverNotifications, setIsMouseOverNotifications] =
    useState(false);
  const socketUserRef = useRef<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsLogo, _] = useState(
    '/static/icons/notifications-bell.svg'
  );
  const socketRequestRef = useRef<WebSocket | null>(null);
  const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

  const handleAccessRequest = (id: any, accepted: boolean) => {
    const type = accepted ? 'requestAccept' : 'requestDecline';
    socketRequestRef!.current!.send(
      JSON.stringify({
        type: type,
        recipientID: id,
        senderID: props.userData.id,
        canvasSlug: window.location.pathname.split('/')[2],
      })
    );
  };

  useLayoutEffect(() => {
    const websocket_url = `${wsProtocol}://${location.host}/user/${props.userData.id}/`;
    socketUserRef.current = new WebSocket(websocket_url);
    const handleMessage = (e: any) => {
      const data = JSON.parse(e.data);
      notifyMe(data);
    };

    socketUserRef!.current!.onclose = () => {};

    socketUserRef.current!.onerror = () => {
      socketUserRef.current!.close();
      socketUserRef.current = new WebSocket(websocket_url);
    };

    socketUserRef.current!.addEventListener('message', handleMessage, false);

    return () => {
      socketUserRef.current!.removeEventListener(
        'message',
        handleMessage,
        false
      );
    };
  }, [props.userData]);

  useLayoutEffect(() => {
    client.get(`/api/notifications/`).then((e) => {
      setNotifications(e.data);
    });
  }, []);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (!notificationsRef.current?.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [showNotifications]);

  const handleAccessCanvas = (
    notification: any,
    type: any,
    accepted: boolean = false
  ) => {
    if (type === 'requestAccess') {
      if (accepted) {
        client.patch(`/api/canvas/update/${notification.canvas.slug}/`, {
          permitted_user: notification.sender.id,
        });
      }

      const websocket_url = `${wsProtocol}://${location.host}/user/${notification.sender.id}/`;
      socketRequestRef.current = new WebSocket(websocket_url);
      socketRequestRef.current.onopen = () => {
        handleAccessRequest(notification.sender.id, accepted);
      };
      socketRequestRef.current.onclose = () => {
        console.log('socket request close');
      };
      socketRequestRef.current.onerror = () => {
        console.log('socket request error');
      };
    }

    client.delete(`/api/notifications/${notification.id}/`).then(() => {
      setNotifications((prevNotifications: any) =>
        prevNotifications.filter((n: any) => n.id !== notification.id)
      );
    });
  };

  const notifyMe = (e: any) => {
    setNotifications((prevNotifications: any) => [...prevNotifications, e]);
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        let text = '';
        let body = '';
        switch (e.type) {
          case 'requestAccess':
            text = 'Request access';
            body = `${e?.sender.email}`;
            break;
          case 'requestAccept':
            text = 'Request accepted';
            body = `${e?.canvas.title}`;
            break;
          case 'requestDecline':
            text = 'Request declined';
            body = `${e?.canvas.title}`;
            break;
        }
        const notification = new Notification(text, {
          body: body,
          icon: '/static/icons/logo_wings.svg',
        });

        const audio = new Audio('/static/sounds/SAD_NOTIFICATION_Master.wav');

        audio.play().catch(() => {});
        notification.addEventListener('show', () => {
          setTimeout(() => {
            notification.close();
          }, 6000);
        });
      }
    });
  };

  return (
    <div
      ref={notificationsRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseOver={() => setIsMouseOverNotifications(true)}
      onMouseOut={() => setIsMouseOverNotifications(false)}
      onClick={() => setShowNotifications(!showNotifications)}
    >
      <object
        className='dashboard-header-notifications-logo'
        type='image/svg+xml'
        data={notificationsLogo}
      />
      {isMouseOverNotifications && !showNotifications && (
        <div className='mouse-over-profile'>What's new?</div>
      )}
      {showNotifications && (
        <div className='modal-form-notifications'>
          {!notifications.length && (
            <li className='notification-item' style={{ textAlign: 'center' }}>
              No new notifications
            </li>
          )}
          {notifications.map((e) => (
            <li className='notification-item'>
              {e.type === 'requestAccess' && (
                <div>
                  Request access to canvas «{e.canvas.title}» from &nbsp;
                  {e.sender.email}
                  <div onClick={() => handleAccessCanvas(e, e.type, true)}>
                    Accept
                  </div>
                  <div onClick={() => handleAccessCanvas(e, e.type, false)}>
                    Decline
                  </div>
                </div>
              )}
              {e.type === 'requestDecline' && (
                <div>
                  Request declined to canvas «{e.canvas.title}» from &nbsp;
                  {e.sender.email}
                  <div onClick={() => handleAccessCanvas(e, e.type)}>
                    Got it
                  </div>
                </div>
              )}
              {e.type === 'requestAccept' && (
                <div>
                  <div onClick={() => handleAccessCanvas(e, e.type)}>
                    Request accepted to canvas «{e.canvas.title}» from &nbsp;
                    {e.sender.email}
                    <a href={`/canvas/${e.canvas.slug}`}>
                      Go to {e.canvas.title}
                    </a>
                  </div>
                  <div onClick={() => handleAccessCanvas(e, e.type)}>
                    Got it
                  </div>
                </div>
              )}
            </li>
          ))}
        </div>
      )}
    </div>
  );
};
export default Notifications;
