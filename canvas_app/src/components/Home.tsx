// import { render } from 'react-dom';
import * as React from 'react';
import '../scss/components/home.scss';
import Header from './Header';
import Footer from './Footer';
import Language from './Language';
import BackgroundButterflies from './BackgroundButterflies';
// import { useCookies } from 'react-cookie';
import { useLayoutEffect, useRef } from 'react';

const HomePage: React.FC = () => {
  const backgroundVideo1 = useRef<HTMLVideoElement>(null);
  const backgroundVideo2 = useRef<HTMLVideoElement>(null);

  const language = Language();

  useLayoutEffect(() => {
    backgroundVideo1.current!.onloadedmetadata = () => {
      setTimeout(() => {
        backgroundVideo2!.current!.play();
        backgroundVideo2!.current!.classList.toggle('hidden');
        setTimeout(() => {
          backgroundVideo2!.current!.classList.toggle('hidden');
        }, (backgroundVideo2!.current!.duration - 2) * 1000);
        // setTimeout(() => {
        setInterval(() => {
          backgroundVideo2!.current!.classList.toggle('hidden');
          setTimeout(() => {
            backgroundVideo2!.current!.classList.toggle('hidden');
          }, (backgroundVideo2!.current!.duration - 2) * 1000);
        }, backgroundVideo2!.current!.duration * 1000);
        // }, backgroundVideo1!.current!.duration * 1000);
      }, (backgroundVideo1!.current!.duration - 2) * 1000);

      backgroundVideo1!.current!.play();
      // backgroundVideo1!.current!.classList.toggle('hidden');
      setTimeout(() => {
        backgroundVideo1!.current!.classList.toggle('hidden');
      }, (backgroundVideo1!.current!.duration - 2) * 1000);
      // setTimeout(() => {
      setInterval(() => {
        backgroundVideo1!.current!.classList.toggle('hidden');
        setTimeout(() => {
          backgroundVideo1!.current!.classList.toggle('hidden');
        }, (backgroundVideo1!.current!.duration - 2) * 1000);
        // }, backgroundVideo1!.current!.duration * 1000);
      }, backgroundVideo1!.current!.duration * 1000);
    };
  }, []);

  return (
    <div className='index-container'>
      <title>Canvas - Space for your creativity</title>
      <img
        src='/static/blue-sky-image.png'
        className='background-image'
        alt='background'
      />
      <video
        ref={backgroundVideo1}
        className='background-image'
        // autoPlay={true}
        preload='auto'
        loop={true}
        muted={true}
        disablePictureInPicture={true}
        webkit-playsinline={true}
        playsInline={true}
        controls={false}
      >
        <source
          src='/static/blue-sky-seen-directly-with-some-clouds_480p.mp4'
          type='video/mp4'
        />
        <source src='/static/blue-sky-image.png' type='image/png' />
      </video>
      <video
        ref={backgroundVideo2}
        className='background-image hidden'
        // autoPlay={true}
        preload='auto'
        loop={true}
        muted={true}
        disablePictureInPicture={true}
        webkit-playsinline={true}
        playsInline={true}
        controls={false}
      >
        <source
          src='/static/blue-sky-seen-directly-with-some-clouds_480p.mp4'
          type='video/mp4'
        />
        <source src='/static/blue-sky-image.png' type='image/png' />
      </video>

      <BackgroundButterflies
        styleClassName='circle-container'
        numberOfButterflies={20}
        fileName='/static/icons/logo_wings.svg'
      />
      <div className='index-main'>
        <Header />
        <div className='flex1'>
          <a href='/dashboard/' id='main-quote'>
            {language.mainPageQuote}
            {/* The outside world is a reflection of the inside one */}
            {/* I’ll see a butterfly and want to reinterpret it through makeup */}
          </a>
          {/* <div
          style={{
            fontFamily: 'Breath_Demo',
            width: '100%',
            color: 'white',
            textAlign: 'center',
            textDecoration: 'none',
            position: 'absolute',
            bottom: '40px',
          }}
        >
          {/* <a
            style={{ textDecoration: 'none', color: 'white' }}
            href='/pixel-battle/'
            id='pixel-battle'
          >
            PIXEL BATTLE
          </a> */}
          {/* </div>  */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
