import Footer from './Footer';
import Header from './Header';
import '../scss/components/_global.scss';

const EmailVerification = () => {
  return (
    <div className='index-container'>
      <div
        className='index-main'
        style={{ color: '#fff', fontFamily: 'Breath_Demo' }}
      >
        <Header />
        <h4>Письмо подтверждения отправлено!</h4>
        <div style={{ fontFamily: 'Breath_Demo' }}>
          На ваш адрес электронной почты было отправлено письмо с
          подтверждением. Пожалуйста, проверьте свою электронную почту и нажмите
          на ссылку подтверждения, чтобы завершить регистрацию. Если письмо не
          пришло, проверьте папку спам.
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EmailVerification;
