import { render } from 'react-dom';
import * as React from 'react';
import '../scss/partials/_home.scss';
// import '../scss/components/_global.scss';

interface NavbarProps {
  items: { id: number; label: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ items }) => (
  <nav className='navbar'>
    {items.map((item) => (
      <div key={item.id} className='navbar-item'>
        {item.label}
      </div>
    ))}
  </nav>
);

const Footer: React.FC = () => <footer className='footer' />;

const HomePage: React.FC = () => {
  const navItems = [
    { id: 1, label: 'Canvas' },
    { id: 2, label: 'SignUp' },
    { id: 3, label: 'SignIn' },
  ];

  return (
    <>
      <div className='container'>
        <Navbar items={navItems} />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
