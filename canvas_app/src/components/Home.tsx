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
    console.log('LANG');
    if (cookies.language !== undefined) {
      setLanguage(languages[cookies.language]);
    } else {
      setLanguage(languages['english']);
    }
  }, []);

  return (
    <div className='index-container'>
      <video
        src='/static/wings.mp4'
        id='background-image'
        autoPlay
        loop
        muted
      />
      <BackgroundButterflies
        styleClassName='circle-container'
        numberOfButterflies={20}
        fileName='/static/icons/logo_wings.svg'
      />

      <div className='index-main'>
        <Header />
        <a href='/dashboard/' id='main-quote'>
          {/* {language.mainPageQuote} */}
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
