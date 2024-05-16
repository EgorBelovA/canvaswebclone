import Header from './Header';
import Footer from './Footer';
import Faq from './Faq';
import PricingCard from './PricingCard';
import '../scss/components/_pricing.scss';
import '../scss/components/home.scss';
import { useState } from 'react';
import BackgroundButterflies from './BackgroundButterflies';

const Premium = () => {
  const elts = {
    text1: document.getElementById('text1'),
    text2: document.getElementById('text2'),
  };

  const texts = ['FAQ', 'F*CK YOU'];

  const morphTime = 1;
  const cooldownTime = 0.25;

  let textIndex = texts.length - 1;
  let time: any = new Date();
  let morph = 0;
  let cooldown = cooldownTime;

  if (elts.text1 && elts.text2) {
    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];
  }

  function doMorph() {
    morph -= cooldown;
    cooldown = 0;

    let fraction = morph / morphTime;

    if (fraction > 1) {
      cooldown = cooldownTime;
      fraction = 1;
    }

    setMorph(fraction);
  }

  function setMorph(fraction: any) {
    if (elts.text1 && elts.text2) {
      elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      fraction = 1 - fraction;
      elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      elts.text1.textContent = texts[textIndex % texts.length];
      elts.text2.textContent = texts[(textIndex + 1) % texts.length];
    }
  }

  function doCooldown() {
    morph = 0;

    if (elts.text1 && elts.text2) {
      elts.text2.style.filter = '';
      elts.text2.style.opacity = '100%';

      elts.text1.style.filter = '';
      elts.text1.style.opacity = '0%';
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    let newTime: any = new Date();
    let shouldIncrementIndex = cooldown > 0;
    let dt = (newTime - time) / 1000;
    time = newTime;
    cooldown -= dt;

    if (cooldown <= 0) {
      if (shouldIncrementIndex) {
        textIndex++;
      }

      doMorph();
    } else {
      doCooldown();
    }
  }

  // const free_plan = ['4 Canvases', 'Basic Support'];
  const premium_plan = ['10 Canvases', 'Support 24h'];

  const [FAQ, setFAQ] = useState('FAQ');

  const FAQOnMouseOver = () => {
    setFAQ('F*CK YOU');

    animate();
  };

  const FAQOnMouseOut = () => {
    setFAQ('FAQ');
  };

  return (
    <div className='index-container'>
      <BackgroundButterflies
        numberOfButterflies={50}
        styleClassName='butterfly-background'
        fileName='/static/icons/butterfly_BG.svg'
      />
      <svg id='filters'>
        <defs>
          <filter id='threshold'>
            <feColorMatrix
              in='SourceGraphic'
              type='matrix'
              values='1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 255 -128'
            />
          </filter>
        </defs>
      </svg>
      <div className='index-main'>
        <Header />
        <div className='pricing-cards-container'>
          <PricingCard
            title='Individual'
            description='A little more'
            price='19 RUB/month'
            list={premium_plan}
            paymentFlag={true}
          />
          <PricingCard
            title='Duo'
            description='Everything'
            price='29 RUB/month'
            list={premium_plan}
            paymentFlag={true}
          />
          <PricingCard
            title='Team'
            description='Everything'
            price='39 RUB/month'
            list={premium_plan}
            paymentFlag={true}
          />
        </div>
        //make comparative table of plans
        <div className='comparative-table-container'>
          <tbody>
            <tr>
              <td>
                <div className='comparative-table-title'>Individual</div>
                <div className='comparative-table-description'>
                  A little more
                </div>
              </td>
              <td>
                <div className='comparative-table-title'>Duo</div>
                <div className='comparative-table-description'>Everything</div>
              </td>
              <td>
                <div className='comparative-table-title'>Team</div>
                <div className='comparative-table-description'>Everything</div>
              </td>
            </tr>
            <tr>
              <td>
                <div className='comparative-table-price'>19 RUB/month</div>
              </td>
              <td>
                <div className='comparative-table-price'>29 RUB/month</div>
              </td>
              <td>
                <div className='comparative-table-price'>39 RUB/month</div>
              </td>
            </tr>
          </tbody>
        </div>
        <div className='pricing-faq-container'>
          <div id='container'>
            <span
              id='text1'
              onMouseOver={FAQOnMouseOver}
              onMouseOut={FAQOnMouseOut}
              className='pricing-faq'
            >
              {FAQ}
            </span>
            <span id='text2'></span>
          </div>
          <Faq />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Premium;