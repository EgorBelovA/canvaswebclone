// import { render } from 'react-dom';
import * as React from 'react';
import '../scss/partials/_navbar.scss';

const Header: React.FC = () => {
  return (
    <nav>
      <div className='header'>
        {/* <div className='navbar'> */}
        <a href='/' className='canvas-logo'>
          <object
            className='logo'
            type='image/svg+xml'
            data='/static/icons/logo_wings.svg'
          />
          <div className='logo-text'>Canvas</div>
        </a>
        <div className='navbar-signup-signin'>
          <a href='/login/' className='navbar-item'>
            Login
          </a>
          <a href='/signup/' className='navbar-item'>
            SignUp
          </a>
          {/* </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Header;
