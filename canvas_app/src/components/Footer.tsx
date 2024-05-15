// import { render } from 'react-dom';
import '../scss/partials/_navbar.scss';
import '../scss/components/home.scss';
import { useState } from 'react';
import Country from './Country';

const Footer = (props: any) => {
  const [isRegionChange, setIsRegionChange] = useState(false);
  // const [locale, setLocale] = useState('US');

  // useEffect(() => {
  //   console.log(navigator);
  //   setLocale(navigator.language.slice(3, 5));
  // }, []);

  // const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
  // const region = regionName.of(locale);

  // const region = 'Russia';

  const languages = [
    { code: 'ru', name: 'Русский', slug: 'russian' },
    { code: 'en', name: 'English', slug: 'english' },
    { code: 'ua', name: 'Українська', slug: 'ukranian' },
  ];

  // const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
  // const region = regionName.of(region);

  // const IS_GEOLOCATION_SUPPORTED = !!navigator?.geolocation?.getCurrentPosition && false;

  const regionChange = () => {
    setIsRegionChange(!isRegionChange);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className='footer'>
        <div className='footer-copyright'>
          {/* <div>Copyright © 2024 Canvas. All Rights Reserved.</div> */}
          <div>{props.language.copyright}</div>
          <div>
            <a href='/legal/privacy-policy/'>Privacy Policy</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href='/legal/terms-and-conditions/'>Terms of Use</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href='/legal/'>Legal</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href='/pricing/'>Pricing</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a href='/contacts/'>Contacts</a>
          </div>
        </div>
        <div onClick={regionChange} className='footer-region'>
          {props.region}
        </div>
      </div>
      {isRegionChange && (
        <div className='modal-region'>
          <div className='modal-title'>
            {' '}
            <div className='modal-title'>
              <h2>Choose a language</h2>
            </div>
            <div>
              <h3>This updates what you read on canvas-professional.com</h3>
            </div>
          </div>
          <div className='modal-content'>
            {languages.map((language: any) => (
              <Country language={language.name} languageSlug={language.slug} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;
