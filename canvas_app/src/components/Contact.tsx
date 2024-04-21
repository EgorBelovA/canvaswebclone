import Header from './Header';
import Footer from './Footer';

const Contact = () => {
  return (
    <div className='index-container'>
      <div className='index-main'>
        <Header />
        <h1 style={{ color: 'white', fontFamily: 'Breath_Demo' }}>
          If you have any questions to the business owner, you can write to his
          personal e-mail: &nbsp;
          <a style={{ color: 'grey' }} href='mailto:ebelov54@gmail.com'>
            ebelov54@gmail.com
          </a>
        </h1>
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
