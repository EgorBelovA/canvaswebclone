import Footer from './Footer';
import Header from './Header';

const PrivacyPolicy = () => {
  //   const Style: any = {
  //     color: 'white',
  //     fontSize: '20px',
  //     fontFamily: 'Arial, Helvetica, sans-serif',
  //     textAlign: 'center',
  //     margin: '20px',
  //     padding: '20px',
  //   };
  return (
    <div className='index-container'>
      <div className='index-main'>
        <Header />
        <div
          style={{
            marginTop: '30vh',
            marginBottom: 'auto',
            color: 'white',
            fontFamily: 'Breath_Demo',
            textAlign: 'center',
            fontSize: '40px',
          }}
        >
          Soon
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
