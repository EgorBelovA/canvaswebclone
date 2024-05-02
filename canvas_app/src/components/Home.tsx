// import { render } from 'react-dom';
import * as React from 'react';
import '../scss/components/home.scss';
import Navbar from './Header';
import Footer from './Footer';
import BackgroundButterflies from './BackgroundButterflies';

const HomePage: React.FC = () => {
  return (
    <div className='index-container'>
      {/* <img src='/wings1.GIF' id='background-image' alt='wings' /> */}
      {/* <img src='/wings3.GIF' id='background-image' alt='wings' /> */}
      <video
        src='/static/wings.mp4'
        id='background-image'
        autoPlay
        loop
        muted
      />
      <BackgroundButterflies />

      <div className='index-main'>
        <Navbar />
        <a href='/dashboard/' id='main-quote'>
          The outside world is a reflection of the inside one
        </a>
        <div>
          <div
            style={{
              fontFamily: 'Breath_Demo',
              color: 'white',
              textAlign: 'center',
              textDecoration: 'none',
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
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
