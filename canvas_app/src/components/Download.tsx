import Header from './Header';
import Footer from './Footer';
import '../scss/components/download.scss';

const Download: React.FC = () => {
  return (
    <div className='index-container'>
      <div className='index-main'>
        <Header />
        <div className='download-container'>
          <h1>Canvas on your phone</h1>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Download;
