// import { render } from 'react-dom';
import * as React from 'react';
import '../scss/partials/_navbar.scss';
// import { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  // const [locale, setLocale] = useState('US');

  // useEffect(() => {
  //   console.log(navigator);
  //   setLocale(navigator.language.slice(3, 5));
  // }, []);

  // const regionName = new Intl.DisplayNames(['en'], { type: 'region' });
  // const region = regionName.of(locale);

  const region = 'Russia';

  return (
    <div className='footer'>
      <div className='footer-copyright'>
        <div>Copyright © 2024 Canvas. All Rights Reserved.</div>
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
      <a href='/choose-county-region/' className='footer-region'>
        {region}
      </a>
    </div>
  );
};

export default Navbar;
