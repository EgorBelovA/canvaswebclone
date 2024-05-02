import '../scss/partials/_sidebar.scss';
// import { useState } from 'react';
import ButtonSidebar from './ButtonSidebar';
import Cursor from '../../public/icons/cursor.svg';
import Pen from '../../public/icons/pen.svg';
import Shapes from '../../public/icons/shapes.svg';

const Sidebar = () => {
  //   const [isPanelVisible, setIsPanelVisible] = useState(false);

  //   const handlePenClick = () => {
  //     setIsPanelVisible(true);
  //   };

  //   const handlePanelClose = () => {
  //     setIsPanelVisible(false);
  //   };

  //   const handleShapeClick = () => {
  //     console.log('Shape button clicked');
  //   };
  //   const src = `${location.origin}/static/icons`;

  return (
    <div className='sidebar'>
      <ButtonSidebar icon={Cursor} />
      <ButtonSidebar icon={Pen} />
      <ButtonSidebar icon={Shapes} />
    </div>
  );
};

export default Sidebar;
