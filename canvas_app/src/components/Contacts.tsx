import Header from './Header';
import Footer from './Footer';
import '../scss/components/contacts.scss';

const Contacts = () => {
  return (
    <div className='index-container'>
      <div className='index-main'>
        <Header />
        <div className='contacts-container flex1'>
          <h2 style={{ wordBreak: 'break-word' }}>
            If you have any questions to the business owner, you can write to
            his personal e-mail&nbsp;
            <a style={{ color: 'grey' }} href='mailto:ebelov54@gmail.com'>
              ebelov54@gmail.com
            </a>
          </h2>
          <div className='contacts-info-container'>
            TAXPAYER IDENTIFICATION NUMBER (TIN) 580314395001
            <br />
            Belov Egor Andreevich
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Contacts;
