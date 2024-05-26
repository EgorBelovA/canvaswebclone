import Header from './Header';
import Footer from './Footer';
import '../scss/components/download.scss';

const Download: React.FC = () => {
  return (
    <div className='index-container'>
      <div className='index-main'>
        <Header />
        <div className='download-container flex1'>
          <h1>Add a shortcut to the Home Screen on iPhone or iPad</h1>
          <li>
            In the Shortcuts app on your iOS or iPadOS device, tap on a
            shortcut, then tap to open Details.
          </li>
          <li>Tap Add to Home Screen.</li>
          <li>The shortcut is added to your Home Screen.</li>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Download;
