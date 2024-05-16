// import { render } from 'react-dom';
import * as React from 'react';
import '../scss/partials/_navbar.scss';
import '../scss/components/home.scss';
import { useLayoutEffect } from 'react';

const Header: React.FC = () => {
  useLayoutEffect(() => {
    document.documentElement.style.setProperty(
      '--viewport-width',
      `${window.innerWidth}px`
    );
    document.documentElement.style.setProperty(
      '--viewport-height',
      `${window.innerHeight}px`
    );
  }, [window.innerWidth, window.innerHeight]);

  const handelMenuActive = () => {
    const menuItems = document.querySelector('.menu-items') as HTMLInputElement;
    const backgroundDark = document.querySelector(
      '.background-dark'
    ) as HTMLInputElement;
    backgroundDark.classList.toggle('active');
    menuItems.classList.toggle('active');
    document.body.classList.toggle('active');
  };
  return (
    <div>
      <div className='background-dark'></div>
      <div className='menu-items'>
        <div className='menu-close'></div>
        <li className='menu-item menu-item-transition'>
          <a className='bold' href='/download/'>
            Download
          </a>
        </li>
        <li
          role='separator'
          aria-hidden='true'
          className='menu-separator menu-item-transition'
        >
          <div className='separator-line' />
        </li>
        <li className='menu-item menu-item-transition'>
          <a href='/signup/'>Sign up</a>
        </li>
        <li className='menu-item menu-item-transition'>
          <a href='/login/'>Log in</a>
        </li>
        <li className='logo-menu menu-item-transition'>
          <div className='canvas-logo'>
            <object
              className='logo'
              type='image/svg+xml'
              data='/static/icons/logo_wings.svg'
            />
            <div className='logo-text'>Canvas</div>
          </div>
        </li>
      </div>
      <nav>
        <div className='header'>
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
              Log in
            </a>
            <a href='/signup/' className='navbar-item'>
              Sign up
            </a>
          </div>
          <div className='menu-hamburger-container'>
            <input
              type='checkbox'
              className='menu-toggle'
              onChange={handelMenuActive}
            />
            <div className='menu-hamburger'>
              <span className='line line1'></span>
              <span className='line line2'></span>
              <span className='line line3'></span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
