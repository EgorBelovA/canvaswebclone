// import { render } from 'react-dom';
import * as React from 'react';
import '../scss/partials/_navbar.scss';
import '../scss/components/home.scss';
import { useLayoutEffect } from 'react';

const Header: React.FC = () => {
  useLayoutEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty(
        '--viewport-width',
        `${window.innerWidth}px`
      );
      document.documentElement.style.setProperty(
        '--viewport-height',
        `${window.innerHeight}px`
      );
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handelMenuActive = () => {
    const menuItems = document.querySelector('.menu-items') as HTMLInputElement;
    const backgroundDark = document.querySelector(
      '.background-dark'
    ) as HTMLInputElement;
    const menuItemsWrapper = document.querySelector(
      '.menu-items-wrapper'
    ) as HTMLInputElement;
    console.log(menuItems);
    backgroundDark.classList.toggle('active');
    menuItems.classList.toggle('active');
    menuItemsWrapper.classList.toggle('active');
    document.body.classList.toggle('active');
    document.documentElement.classList.toggle('active');
  };
  return (
    <div>
      <div className='background-dark'></div>
      <div className='menu-items-wrapper'>
        <div className='menu-items'>
          <li className='menu-item menu-item-transition'>
            <a className='bold' href='/premium/'>
              Premium
            </a>
          </li>
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
            <a className='canvas-logo' href='/'>
              <object
                className='logo'
                type='image/svg+xml'
                data='/static/icons/logo_wings.svg'
              />
              <div className='logo-text'>Canvas</div>
            </a>
          </li>
        </div>
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
          <div className='navbar-container-right'>
            <div className='navbar-helpers'>
              <a href='/premium/' className='navbar-item-helper'>
                Premium
              </a>
              <a href='/download/' className='navbar-item-helper'>
                Download
              </a>
            </div>
            <div className='navbar-separator'></div>
            <div className='navbar-signup-signin'>
              <a href='/login/' className='navbar-item'>
                Log in
              </a>
              <a href='/signup/' className='navbar-item'>
                Sign up
              </a>
            </div>
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
