import { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Canvas from './Canvas';
import SignUp from './SignUp';
import Login from './Login';
import EmailVerification from './EmailVerification';
import Dashboard from './Dashboard';
import PrivateRoutes from './PrivateRoutes';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfUse from './TermsOfUse';
import CountryRegion from './CountyRegion';
import Legal from './Legal';
import Pricing from './Pricing';
import Contact from './Contact';

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
          <Route element={<PrivateRoutes />}>
            <Route path='canvas/:slug/' element={<Canvas />} />
          </Route>
          <Route path='legal/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='legal/terms-and-conditions' element={<TermsOfUse />} />
          <Route path='choose-county-region' element={<CountryRegion />} />
          <Route path='legal' element={<Legal />} />
          <Route path='email-verification' element={<EmailVerification />} />
          <Route path='pricing' element={<Pricing />} />
          <Route path='contact' element={<Contact />} />
        </Routes>
      </Router>
    );
  }
}
