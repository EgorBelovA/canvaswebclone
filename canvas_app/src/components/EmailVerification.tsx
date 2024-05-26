import Footer from './Footer';
import Header from './Header';
import '../scss/components/email-verification.scss';

const EmailVerification = () => {
  return (
    <div className='index-container'>
      <div className='index-main'>
        <Header />
        <div className='email-verification-container flex1'>
          <h4>The confirmation email has been sent!</h4>
          <div>
            <div>
              A confirmation e-mail has been sent to your e-mail address.
              confirmation.
            </div>
            <div>
              Please check your e-mail and click on the confirmation link to
              complete your registration.
            </div>
            <div>If email has not arrived, please check your spam folder.</div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EmailVerification;
