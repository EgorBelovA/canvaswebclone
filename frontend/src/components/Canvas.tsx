import React, { useRef, useEffect, useState } from 'react';
import './styles/canvas.css';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorsRef = useRef<HTMLDivElement>(null);
  const cursor_svg = useRef<HTMLElement>(null);
  const socketRef = useRef<Event>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const cursor = cursor_svg.current;
    const w = canvas.width;
    const h = canvas.height;

    const state = { xoffset: 0, yoffset: 0 };

    const colors = document.getElementsByClassName('color');
    const current = {
      color: 'black',
    };

    let dataURL = '';
    let drawing = false;

    const onColorUpdate = (e) => {
      current.color = e.target.className.split(' ')[1];
    };

    const drawLine = (x0, y0, x1, y1, color, send) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
      context.save();
      dataURL = canvasRef.current.toDataURL('image/png');

      if (!send) {
        return;
      }

      socketRef.current.send(
        JSON.stringify({
          x0: x0 / w,
          y0: y0 / h,
          x1: x1 / w,
          y1: y1 / h,
          color,
        })
      );
    };

    const onMouseDown = (e) => {
      drawing = true;
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const mouse_pos_send = (x0, y0, x1, y1, color) => {
      console.log(socketRef.current);
      if (socketRef.current.type == 'open') {
        socketRef.current.send(
          JSON.stringify({
            x0: x0 / w,
            y0: y0 / h,
            x1: x1 / w,
            y1: y1 / h,
            color,
          })
        );
      }
    };
    const onMouseMove = (e) => {
      document.querySelector('#cursor').style.left = `${e.clientX}px`;
      document.querySelector('#cursor').style.top = `${e.clientY}px`;

      mouse_pos_send(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color
      );
      console.log(drawing);

      if (!drawing) return;
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true
      );
      current.x = e.clientX || e.touches[0].clientX;
      current.y = e.clientY || e.touches[0].clientY;
    };

    const onMouseUp = (e) => {
      if (!drawing) return;
      drawing = false;
      drawLine(
        current.x,
        current.y,
        e.clientX || e.touches[0].clientX,
        e.clientY || e.touches[0].clientY,
        current.color,
        true
      );
    };

    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime();
      return function () {
        const time = new Date().getTime();
        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    canvas.addEventListener('touchstart', onMouseDown, false);
    canvas.addEventListener('touchend', onMouseUp, false);
    canvas.addEventListener('touchcancel', onMouseUp, false);
    canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);

    for (let i = 0; i < colors.length; ++i) {
      colors[i].addEventListener('click', onColorUpdate, false);
    }

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      let img = document.createElement('img');
      img.src = dataURL;
      context.drawImage(img, 0, 0);
      context.restore();
    };

    window.addEventListener('resize', onResize, false);
    onResize();

    const onDrawingEvent = (data) => {
      //   if (data.color) {
      drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color);
      //   }
    };

    socketRef.current = new WebSocket('ws://127.0.0.1:8000/');

    socketRef.current.onopen = (e) => {
      console.log('open', e);
    };

    socketRef.current.onmessage = (e) => {
      console.log(e);
      onDrawingEvent(JSON.parse(e.data));
    };

    socketRef.current.onerror = (e) => {
      console.log('error', e);
    };
  }, []);

  return (
    <div>
      <div id='cursor' style={{ position: 'absolute' }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='100'
          viewBox='0 0 50 50'
          ref={cursor_svg}
        >
          <path d='M 29.699219 47 C 29.578125 47 29.457031 46.976563 29.339844 46.933594 C 29.089844 46.835938 28.890625 46.644531 28.78125 46.398438 L 22.945313 32.90625 L 15.683594 39.730469 C 15.394531 40.003906 14.96875 40.074219 14.601563 39.917969 C 14.238281 39.761719 14 39.398438 14 39 L 14 6 C 14 5.601563 14.234375 5.242188 14.601563 5.082031 C 14.964844 4.925781 15.390625 4.996094 15.683594 5.269531 L 39.683594 27.667969 C 39.972656 27.9375 40.074219 28.355469 39.945313 28.726563 C 39.816406 29.101563 39.480469 29.363281 39.085938 29.398438 L 28.902344 30.273438 L 35.007813 43.585938 C 35.117188 43.824219 35.128906 44.101563 35.035156 44.351563 C 34.941406 44.601563 34.757813 44.800781 34.515625 44.910156 L 30.113281 46.910156 C 29.980469 46.96875 29.84375 47 29.699219 47 Z'></path>
        </svg>
      </div>
      <canvas ref={canvasRef} className='canvas' />

      <div ref={colorsRef} className='colors'>
        <div className='color black'></div>
        <div className='color red'></div>
        <div className='color green'></div>
        <div className='color blue'></div>
        <div className='color yellow'></div>
      </div>
    </div>
  );
};

export default Canvas;
