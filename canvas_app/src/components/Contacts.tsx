import Header from './Header';
import Footer from './Footer';

const Contacts = () => {
  return (
    <div className='index-container'>
      <div className='index-main'>
        <div>
          <Header />
          <h1 style={{ color: '#fff', fontFamily: 'Breath_Demo' }}>
            If you have any questions to the business owner, you can write to
            his personal e-mail &nbsp;
            <a style={{ color: 'grey' }} href='mailto:ebelov54@gmail.com'>
              ebelov54@gmail.com
            </a>
          </h1>
        </div>
        <div>
          <div
            style={{
              color: '#fff',
              fontFamily: 'Breath_Demo',
              position: 'absolute',
              bottom: '40px',
            }}
          >
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
