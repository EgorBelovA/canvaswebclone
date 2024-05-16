import { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Canvas from './Canvas';
import SignUp from './SignUp';
import Login from './Login';
import EmailVerification from './EmailVerification';
import Dashboard from './Dashboard';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';
import CountryRegion from './CountyRegion';
import Legal from './Legal';
import Premium from './Premium';
import Contacts from './Contacts';
import PixelBattle from './PixelBattle';
import UserProfile from './UserProfile';
import JWTAuth from './JWTAuth';
import Download from './Download';

export default class HomePage extends Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='signup' element={<SignUp />} />
          <Route path='login' element={<Login />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='canvas/:slug/' element={<Canvas />} />
          <Route path='profile' element={<UserProfile />} />
          <Route path='legal/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='legal/terms-and-conditions' element={<TermsOfUse />} />
          <Route path='choose-county-region' element={<CountryRegion />} />
          <Route path='legal' element={<Legal />} />
          <Route path='email-verification' element={<EmailVerification />} />
          <Route path='premium' element={<Premium />} />
          <Route path='contacts' element={<Contacts />} />
          <Route path='pixel-battle' element={<PixelBattle />} />
          <Route path='jwt/auth' element={<JWTAuth />} />
          <Route path='download' element={<Download />} />
        </Routes>
      </Router>
    );
  }
}
