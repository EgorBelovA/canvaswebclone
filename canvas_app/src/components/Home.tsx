// import { render } from 'react-dom';
import * as React from 'react';
import '../scss/components/home.scss';
import Header from './Header';
import Footer from './Footer';
import BackgroundButterflies from './BackgroundButterflies';
import { useCookies } from 'react-cookie';
import { useState, useLayoutEffect } from 'react';
import russian from '../localization/Russian.json';
import ukranian from '../localization/Ukrainian.json';
import english from '../localization/English.json';

const HomePage: React.FC = () => {
  const [cookies, _] = useCookies(['language']);
  const [language, setLanguage] = useState<any>({});
  const languages: { [key: string]: any } = {
    russian,
    ukranian,
    english,
  };

  useLayoutEffect(() => {
    if (cookies.language !== undefined) {
      setLanguage(languages[cookies.language]);
    } else {
      setLanguage(languages['english']);
    }
  }, []);

  return (
    <div className='index-container'>
      <title>Canvas - Space for your creativity</title>

      <video
        id='background-image'
        autoPlay={true}
        loop={true}
        muted={true}
        disablePictureInPicture={true}
        webkit-playsinline={true}
        playsInline={true}
        controls={false}
      >
        <source src='/static/wings.mp4' type='video/mp4' />
      </video>
      <BackgroundButterflies
        styleClassName='circle-container'
        numberOfButterflies={20}
        fileName='/static/icons/logo_wings.svg'
      />
      <div className='index-main'>
        <Header />
        <a href='/dashboard/' id='main-quote'>
          {/* {language.mainPageQuote} */}
          The outside world is a reflection of the inside one
        </a>
        <div
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
          <a
            style={{ textDecoration: 'none', color: 'white' }}
            href='/pixel-battle/'
            id='pixel-battle'
          >
            PIXEL BATTLE
          </a>
        </div>
        <div>
          <Footer language={language} region={'russia'} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
