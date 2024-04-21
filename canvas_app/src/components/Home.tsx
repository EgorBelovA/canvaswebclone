// import { render } from 'react-dom';
import * as React from 'react';
import '../scss/partials/_home.scss';
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

      <div className='index-main'>
        <BackgroundButterflies />

        <Navbar />
        <a href='/dashboard/' id='main-quote'>
          The outside world is a reflection of the inside one
        </a>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
