import '../scss/components/canvas.scss';
// import axios from 'axios';
// import { useState, useLayoutEffect, useLayoutEffect } from 'react';

// axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
// axios.defaults.xsrfCookieName = 'csrftoken';
// axios.defaults.withCredentials = true;

// const client = axios.create({
//   baseURL: location.origin,
// });

const JWTAuth = () => {
  // useLayoutEffect(() => {
  // client
  //   .get('/api/user/')
  //   .then(async (e: any) => {
  //     client.post(
  //       'https://oauth2.googleapis.com/token',
  //       (data = {
  //         code: code,
  //         client_id: constants.GOOGLE_CLIENT_ID,
  //         client_secret: constants.GOOGLE_CLIENT_SECRET,
  //         redirect_uri: constants.GOOGLE_REDIRECT_URI,
  //         grant_type: 'authorization_code',
  //       })
  //     );
  //     localStorage.clear();
  //     localStorage.setItem('access_token', data.access);
  //     localStorage.setItem('refresh_token', data.refresh);
  //   })
  //   .catch(function () {
  //     // window.location.href = '/login/';
  //   });
  // }, []);
  return (
    <div
      className='loading_container'
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'white',
        position: 'absolute',
        zIndex: 1000,
      }}
    >
      <object
        className='loading_logo'
        data='/static/icons/logo_wings.svg'
        type='image/svg+xml'
      ></object>
    </div>
  );
};

export default JWTAuth;
