// import { useEffect, useState } from 'react';

// const PixelBattle = () => {
//   const [clicked, setClicked] = useState<boolean>(false);

//   const handleClick = () => {
//     if (!clicked) {
//       setClicked(true);
//       setTimeout(() => {
//         setClicked(false);
//       }, 60000);
//     }
//   };

//   useEffect(() => {
//     console.log('clicked');
//   }, []);

//   return (
//     <div>
//       <h1>Pixel Battle Canvas</h1>

//       </div>
//     </div>
//   );
// };

// export default PixelBattle;

import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
import { useCookies } from 'react-cookie';

const PixelBattle: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [, setLastClickTime] = useState<number>(0);
  const [cookies, setCookie] = useCookies(['time']);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Drawing logic goes here
  }, []);

  //timer for cooldown
  useEffect(() => {
    const interval = setInterval(() => {
      if (cookies.time) {
        setCookie('time', '');
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [cookies.time]);

  //stopwatch for cooldown

  const [clickCooldown, setClickCooldown] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setClickCooldown((prev) => prev + 100);
      console.log(clickCooldown);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    const currentTime = new Date().getTime();
    if (currentTime - cookies.time >= 1000 || !cookies.time) {
      // 1 minute delay
      console.log(1);
      setLastClickTime(currentTime);
      setCookie('time', currentTime.toString());

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Drawing logic goes here
      //random color
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const randomColor = `rgb(${r}, ${g}, ${b})`;
      ctx.fillStyle = randomColor;

      //make 20 block in canvas and fill one of them on click
      const blockWidth = canvas.width / 5;
      const blockHeight = canvas.height / 4;
      const x = Math.floor(Math.random() * 5) * blockWidth;
      const y = Math.floor(Math.random() * 4) * blockHeight;
      ctx.fillRect(x, y, blockWidth, blockHeight);

      // 1 minute delay

      console.log(2);
    } else {
      alert('Please wait 1 minute before clicking again.');
    }
  };

  return (
    <canvas ref={canvasRef} width={800} height={600} onClick={handleClick} />
  );
};

export default PixelBattle;
