//Notifications

// import { useEffect } from 'react';
// import { useCookies } from 'react-cookie';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

// const client = axios.create({
//   baseURL: location.origin,
// });

const Notifications = () => {
  //   const [cookies] = useCookies(['access_token']);
  //   const navigate = useNavigate();
  //   useEffect(() => {
  //     client
  //       .get('/api/notifications/', {
  //         // headers: {
  //         //   Authorization: `Bearer ${cookies['access_token']}`,
  //         // },
  //       })
  //       .then(function (response) {
  //         console.log(response.data);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }, []);
  return <></>;
};
export default Notifications;
