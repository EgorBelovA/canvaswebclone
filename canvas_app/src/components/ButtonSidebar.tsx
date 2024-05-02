// import { useState } from 'react';
import '../scss/partials/_button-sidebar.scss';
function ButtonSidebar(props: any) {
  // const [name, setName] = useState(false);

  //   const handleShapeClick = () => {
  //     console.log('Shape button clicked');
  //   };

  return (
    <div className='button-sidebar'>
      <object
        type='image/svg+xml'
        data={`${props.icon}`}
        width='24px'
        id='object'
      />
    </div>
  );
}

export default ButtonSidebar;
