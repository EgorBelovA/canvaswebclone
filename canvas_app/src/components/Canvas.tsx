// import { useRef, useEffect } from 'react';
// // import Cursor from './Cursor/Cursor';

// const Canvas = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
// const colorsRef = useRef<HTMLDivElement>(null);
// const socketRef = useRef<WebSocket | null>(null);
//   const cursor_svg = useRef<SVGSVGElement>(null);

// const navigate = useNavigate();
// const slug = window.location.pathname.split('/')[2];
//   // console.log(slug);

// client
//   .get(`/api/canvas/${slug}/`)
//   .then((e) => {
//     console.log(e.data);
//   })
//   .catch((e) => {
//     console.log(e);
//     navigate('/dashboard/');
//   });
//   useEffect(() => {
//     // const canvas = useRef<fabric.Canvas>(null);

//     // canvas.current = new fabric.Canvas(canvasRef.current, {
//     //   imageSmoothingEnabled: false,
//     // });
//     const canvas = canvasRef.current;
//     const context = canvas?.getContext('2d');
//     const w = canvas?.width || 0;
//     const h = canvas?.height || 0;

//     const current = {
//       color: 'black',
//       x: 0,
//       y: 0,
//     };

//     let dataURL = '';
//     let drawing = false;

//     const drawLine = (
//       x0: any,
//       y0: any,
//       x1: any,
//       y1: any,
//       color: any,
//       send: any
//     ) => {
//       context?.beginPath();
//       context?.moveTo(x0, y0);
//       context?.lineTo(x1, y1);
//       context!.strokeStyle = color;
//       context!.lineWidth = 10;
//       context?.stroke();
//       context!.lineCap = 'round';
//       context?.closePath();
//       context?.save();
//       // console.log(context);
//       // var canvasSVGContext = new canvas.Deferred();
//       // context.wrapCanvas(document.querySelector('canvas'));
//       // console.log(canvasSVGContext.getSVG());
//       // dataURL = canvasRef!.current!.toDataURL('image/webp', 1);

//       if (!send) {
//         return;
//       }

//       socketRef?.current?.send(
//         JSON.stringify({
//           x0: x0 / w,
//           y0: y0 / h,
//           x1: x1 / w,
//           y1: y1 / h,
//           color,
//         })
//       );
//     };

//     const onMouseDown = (e: any) => {
//       drawing = true;
//       current!.x = e.clientX || e.touches[0].clientX;
//       current!.y = e.clientY || e.touches[0].clientY;
//     };

//     // const mouse_pos_send = (x0, y0, x1, y1, color) => {
//     //   if (socketRef.current.readyState) {
//     //     socketRef.current.send(
//     //       JSON.stringify({
//     //         x0: x0 / w,
//     //         y0: y0 / h,
//     //         x1: x1 / w,
//     //         y1: y1 / h,
//     //         color,
//     //       })
//     //     );
//     //   }
//     // };
//     const onMouseMove = (e: any) => {
//       // if (!drawing) {
//       //   mouse_pos_send(
//       //     current.x,
//       //     current.y,
//       //     e.clientX || e.touches[0].clientX,
//       //     e.clientY || e.touches[0].clientY,
//       //     null
//       //   );
//       // }

//       if (!drawing) return;
//       drawLine(
//         current.x,
//         current.y,
//         e.clientX || e.touches[0].clientX,
//         e.clientY || e.touches[0].clientY,
//         current.color,
//         true
//       );
//       current.x = e.clientX || e.touches[0].clientX;
//       current.y = e.clientY || e.touches[0].clientY;
//     };

//     const onMouseUp = () => {
//       if (!drawing) return;
//       drawing = false;
//     };

//     const throttle = (callback: any, delay: any) => {
//       let previousCall = new Date().getTime();
//       return function () {
//         const time = new Date().getTime();
//         if (time - previousCall >= delay) {
//           previousCall = time;
//           callback.apply(null, arguments);
//         }
//       };
//     };

//     canvas?.addEventListener('mousedown', onMouseDown, false);
//     canvas?.addEventListener('mouseup', onMouseUp, false);
//     canvas?.addEventListener('mouseout', onMouseUp, false);
//     canvas?.addEventListener('mousemove', throttle(onMouseMove, 5), false);

//     canvas?.addEventListener('touchstart', onMouseDown, false);
//     canvas?.addEventListener('touchend', onMouseUp, false);
//     canvas?.addEventListener('touchcancel', onMouseUp, false);
//     canvas?.addEventListener('touchmove', throttle(onMouseMove, 5), false);

//     // const mouseDownEvent = new MouseEvent('mousedown', {
//     //   bubbles: true,
//     //   cancelable: true,
//     //   view: window,
//     // });

//     // canvas?.addEventListener('mouseleave', handleMouseLeave);
//     // canvas?.addEventListener('mouseenter', handleMouseEnter);

//     // function handleMouseLeave(event: MouseEvent) {
//     //   // if (event.target !== canvas) {
//     //   console.log(123);
//     //   event.preventDefault();
//     //   event.stopPropagation();
//     //   // }
//     // }

//     // function handleMouseEnter(event: MouseEvent) {
//     //   // if (event.target !== canvas) {
//     //   canvas?.dispatchEvent(mouseDownEvent);
//     //   event.preventDefault();
//     //   event.stopPropagation();
//     //   // }
//     // }
//     const onColorUpdate = (e: any) => {
//       console.log(e.target.value);
//       current.color = e.target.value;
//     };

//     const color = colorsRef.current?.querySelector('#color');
//     color?.addEventListener('change', onColorUpdate, false);

//     const onResize = () => {
//       canvas!.width = window.innerWidth;
//       canvas!.height = window.innerHeight;
//       let img = document.createElement('img');
//       img.src = dataURL;
//       // context?.drawImage(img, 0, 0);
//       context?.restore();
//       // context?.scale(2, 2);
//       // console.log(123);
//     };

//     window.addEventListener('resize', onResize, false);
//     onResize();

// const onDrawingEvent = (data: any) => {
//   // Cursor.setState({ x0: `${data.x1 * w}px` });
//   // document.querySelector('#cursor').style.left = `${data.x1 * w}px`;
//   // document.querySelector('#cursor').style.top = `${data.y1 * h}px`;
//   if (data.color) {
//     drawLine(
//       data.x0 * w,
//       data.y0 * h,
//       data.x1 * w,
//       data.y1 * h,
//       data.color,
//       false
//     );
//   }
// };
//     // const websocket_url = 'ws://' + location.host + '/socket-server/';
//     const websocket_url = `ws://${location.host}/${slug}/`;
//     socketRef.current = new WebSocket(websocket_url);

//     socketRef.current.onopen = (e: any) => {
//       console.log('open', e);
//     };

//     socketRef.current.onmessage = (e: any) => {
//       // console.log(e);
//       onDrawingEvent(JSON.parse(e.data));
//     };

//     socketRef.current!.onerror = (e: any) => {
//       console.log('error', e);
//     };
//   }, []);

//   return (
//     <div>
//       <DisableZoom />
//       <Sidebar />

//       <div id='cursor' style={{ position: 'absolute' }}>
//         <svg
//           xmlns='http://www.w3.org/2000/svg'
//           width='20'
//           height='100'
//           viewBox='0 0 50 50'
//           ref={cursor_svg}
//         >
//           <path d='M 29.699219 47 C 29.578125 47 29.457031 46.976563 29.339844 46.933594 C 29.089844 46.835938 28.890625 46.644531 28.78125 46.398438 L 22.945313 32.90625 L 15.683594 39.730469 C 15.394531 40.003906 14.96875 40.074219 14.601563 39.917969 C 14.238281 39.761719 14 39.398438 14 39 L 14 6 C 14 5.601563 14.234375 5.242188 14.601563 5.082031 C 14.964844 4.925781 15.390625 4.996094 15.683594 5.269531 L 39.683594 27.667969 C 39.972656 27.9375 40.074219 28.355469 39.945313 28.726563 C 39.816406 29.101563 39.480469 29.363281 39.085938 29.398438 L 28.902344 30.273438 L 35.007813 43.585938 C 35.117188 43.824219 35.128906 44.101563 35.035156 44.351563 C 34.941406 44.601563 34.757813 44.800781 34.515625 44.910156 L 30.113281 46.910156 C 29.980469 46.96875 29.84375 47 29.699219 47 Z'></path>
//         </svg>
//       </div>
//       <canvas ref={canvasRef} className='canvas' />
//       <div ref={colorsRef} className='colors'>
//         <input id='color' type='color' />
//       </div>
//     </div>
//   );
// };

// export default Canvas;

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import getStroke from 'perfect-freehand';
// import DisableZoom from './DisableZoom';
import '../scss/partials/_canvas.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: location.origin,
});

const generator = rough.generator();

const createElement = (
  id: any,
  x1: any,
  y1: any,
  x2: any,
  y2: any,
  type: any
) => {
  switch (type) {
    case 'line':
    case 'rectangle':
      const roughElement =
        type === 'line'
          ? generator.line(x1, y1, x2, y2, { roughness: 0 })
          : generator.rectangle(x1, y1, x2 - x1, y2 - y1, { roughness: 0 });
      return { id, x1, y1, x2, y2, type, roughElement };
    case 'pencil':
      return { id, type, points: [{ x: x1, y: y1 }] };
    case 'text':
      return { id, type, x1, y1, x2, y2, text: '' };
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

const nearPoint = (x: any, y: any, x1: any, y1: any, name: any) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (
  x1: any,
  y1: any,
  x2: any,
  y2: any,
  x: any,
  y: any,
  maxDistance = 1
) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? 'inside' : null;
};

const positionWithinElement = (x: any, y: any, element: any) => {
  const { type, x1, x2, y1, y2 } = element;
  switch (type) {
    case 'line':
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, 'start');
      const end = nearPoint(x, y, x2, y2, 'end');
      return start || end || on;
    case 'rectangle':
      const topLeft = nearPoint(x, y, x1, y1, 'tl');
      const topRight = nearPoint(x, y, x2, y1, 'tr');
      const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
      const bottomRight = nearPoint(x, y, x2, y2, 'br');
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case 'pencil':
      const betweenAnyPoint = element.points.some((point: any, index: any) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;
        return (
          onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 1) != null
        );
      });
      return betweenAnyPoint ? 'inside' : null;
    case 'text':
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

const distance = (a: any, b: any) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x: any, y: any, elements: any) => {
  return elements
    .map((element: any) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element: any) => element.position !== null);
};

const adjustElementCoordinates = (element: any) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === 'rectangle') {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

const cursorForPosition = (position: any) => {
  switch (position) {
    case 'tl':
    case 'br':
    case 'start':
    case 'end':
      return 'nwse-resize';
    case 'tr':
    case 'bl':
      return 'nesw-resize';
    default:
      return 'move';
  }
};

const resizedCoordinates = (
  clientX: any,
  clientY: any,
  position: any,
  coordinates: any
) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case 'tl':
    case 'start':
      return { x1: clientX, y1: clientY, x2, y2 };
    case 'tr':
      return { x1, y1: clientY, x2: clientX, y2 };
    case 'bl':
      return { x1: clientX, y1, x2, y2: clientY };
    case 'br':
    case 'end':
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null; //should not really get here...
  }
};

const useHistory = (initialState: any) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action: any, overwrite = false) => {
    const newState =
      typeof action === 'function' ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () =>
    index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return [history[index], setState, undo, redo];
};

const getSvgPathFromStroke = (stroke: any) => {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc: any, [x0, y0]: any, i: any, arr: any) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
};

const drawElement = (roughCanvas: any, context: any, element: any) => {
  switch (element.type) {
    case 'line':
    case 'rectangle':
      roughCanvas.draw(element.roughElement);
      break;
    case 'pencil':
      // console.log(element.points);
      const stroke = getSvgPathFromStroke(getStroke(element.points));
      context.fillStyle = 'red';
      context.fill(new Path2D(stroke));

      break;
    case 'text':
      context.textBaseline = 'top';
      context.font = '24px sans-serif';
      context.fillText(element.text, element.x1, element.y1);
      break;
    default:
      throw new Error(`Type not recognised: ${element.type}`);
  }
};

const adjustmentRequired = (type: any) => ['line', 'rectangle'].includes(type);

const usePressedKeys = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      setPressedKeys((prevKeys) => new Set(prevKeys).add(event.key));
    };

    const handleKeyUp = (event: any) => {
      setPressedKeys((prevKeys) => {
        const updatedKeys = new Set(prevKeys);
        updatedKeys.delete(event.key);
        return updatedKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return pressedKeys;
};

const Canvas = () => {
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState('none');
  const [tool, setTool] = useState('rectangle');
  const [selectedElement, setSelectedElement] = useState(null) as any;
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = React.useState({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = React.useState(1);
  const [scaleOffset, setScaleOffset] = React.useState({ x: 0, y: 0 });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const pressedKeys = usePressedKeys();
  const colorsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const slug = window.location.pathname.split('/')[2];

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    client
      .get(`/api/canvas/${slug}/`)
      .then((e) => {
        console.log(e.data);
      })
      .catch((e) => {
        console.log(e);
        navigate('/dashboard/');
      });
  }, []);

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas?.getContext('2d');
    const roughCanvas = rough.canvas(canvas!);

    context!.clearRect(0, 0, canvas.width, canvas.height);

    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;

    const scaleOffsetX = (scaledWidth - canvas.width) / 2;
    const scaleOffsetY = (scaledHeight - canvas.height) / 2;
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

    context!.save();
    context!.translate(
      panOffset.x * scale - scaleOffsetX,
      panOffset.y * scale - scaleOffsetY
    );
    context!.scale(scale, scale);

    elements.forEach((element: any) => {
      if (action === 'writing' && selectedElement!.id === element.id) return;
      drawElement(roughCanvas, context, element);
    });
    context!.restore();
  }, [elements, action, selectedElement, panOffset, scale]);

  useEffect(() => {
    const undoRedoFunction = (event: any) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener('keydown', undoRedoFunction);
    return () => {
      document.removeEventListener('keydown', undoRedoFunction);
    };
  }, [undo, redo]);

  // function detectTrackPad(e: any) {
  //   console.log(e);
  // }
  // useEffect(() => {
  //   document.addEventListener('mousewheel', detectTrackPad, false);
  //   document.addEventListener('DOMMouseScroll', detectTrackPad, false);
  //   document.addEventListener('resize', detectTrackPad, false);

  //   return () => {
  //     document.removeEventListener('mousewheel', detectTrackPad, false);
  //     document.removeEventListener('DOMMouseScroll', detectTrackPad, false);
  //     document.removeEventListener('resize', detectTrackPad, false);
  //   };
  // }, []);

  useEffect(() => {
    const panOrZoomFunction = (event: any) => {
      if (pressedKeys.has('Meta') || pressedKeys.has('Control'))
        onZoom(event.deltaY * -0.01);
      else
        setPanOffset((prev) => ({
          x: prev.x - event.deltaX,
          y: prev.y - event.deltaY,
        }));
    };

    document.addEventListener('wheel', panOrZoomFunction);
    return () => {
      document.removeEventListener('wheel', panOrZoomFunction);
    };
  }, [pressedKeys]);

  const panOrZoomFunction = (event: any) => {
    if (pressedKeys.has('Meta') || pressedKeys.has('Control'))
      onZoom(event.deltaY * -0.01);
    else
      setPanOffset((prev) => ({
        x: prev.x - event.deltaX,
        y: prev.y - event.deltaY,
      }));
  };

  document.addEventListener('wheel', panOrZoomFunction, { passive: false });

  useEffect(() => {
    const websocket_url = `ws://${location.host}/${slug}/`;
    socketRef.current = new WebSocket(websocket_url);

    socketRef.current.onopen = (e: any) => {
      console.log('open', e);
    };

    socketRef.current.onmessage = (e: any) => {
      let data = JSON.parse(e.data);
      console.log(data.element);
      // const id = elements.length;
      // const element = createElement(
      //   id,
      //   data.x0,
      //   data.y0,
      //   data.x1,
      //   data.y1,
      //   'pencil'
      // );
      // console.log(element);
      // setElements((prevState: any) => [...prevState, element]);
      // setSelectedElement(element);

      // setAction(tool === 'text' ? 'writing' : 'drawing');

      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const roughCanvas = rough.canvas(canvas!);
      const context = canvas?.getContext('2d');

      // const id = elements.length;
      // const element = createElement(
      //   id,
      //   data.element.x0,
      //   data.element.y0,
      //   data.element.x1,
      //   data.element.y1,
      //   tool
      // );
      // setElements((prevState: any) => [...prevState, element]);
      // setSelectedElement(element);
      // const id = elements.length;
      // console.log(
      //   data.element.type,
      //   data.element.x0,

      //   data.element
      // );
      // updateElement(
      //   id,
      //   data.element.x1,
      //   data.element.y1,
      //   data.element.x2,
      //   data.element.y2,
      //   data.element.type,
      //   null
      // );
      // elements.type = 'pencil';
      // data.type = 'pencil';
      // elements.points = [{ x: 0, y: 0 }];
      drawElement(roughCanvas, context, data.element);
      // handleMouseMove(JSON.parse(e.data));
    };

    socketRef.current!.onerror = (e: any) => {
      console.log('error', e);
    };
  }, []);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === 'writing') {
      setTimeout(() => {
        if (textArea) {
          textArea.focus();
          textArea.value = selectedElement.text;
        }
      }, 0);
    }
  }, [action, selectedElement]);

  const updateElement = (
    id: any,
    x1: any,
    y1: any,
    x2: any,
    y2: any,
    type: any,
    options: any
  ) => {
    const elementsCopy = [...elements];

    switch (type) {
      case 'line':
      case 'rectangle':
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case 'pencil':
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      case 'text':
        const canvasElement = document.getElementById(
          'canvas'
        ) as HTMLCanvasElement;
        if (canvasElement) {
          const context = canvasElement.getContext('2d');
          if (context) {
            const textWidth = context.measureText(options.text).width;
            const textHeight = 24;
            elementsCopy[id] = {
              ...createElement(
                id,
                x1,
                y1,
                x1 + textWidth,
                y1 + textHeight,
                type
              ),
              text: options.text,
            };
          }
        }
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    setElements(elementsCopy, true);
  };

  const getMouseCoordinates = (event: any) => {
    const clientX =
      (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
    const clientY =
      (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;
    return { clientX, clientY };
  };

  const handleMouseDown = (event: any) => {
    if (action === 'writing') return;

    const { clientX, clientY } = getMouseCoordinates(event);

    if (event.button === 1 || pressedKeys.has(' ')) {
      setAction('panning');
      setStartPanMousePosition({ x: clientX, y: clientY });
      return;
    }

    if (tool === 'selection') {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === 'pencil') {
          const xOffsets = element.points.map(
            (point: any) => clientX - point.x
          );
          const yOffsets = element.points.map(
            (point: any) => clientY - point.y
          );
          setSelectedElement({ ...element, xOffsets, yOffsets });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
        }
        setElements((prevState: any) => prevState);

        if (element.position === 'inside') {
          setAction('moving');
        } else {
          setAction('resizing');
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );
      setElements((prevState: any) => [...prevState, element]);
      setSelectedElement(element);

      setAction(tool === 'text' ? 'writing' : 'drawing');
    }
  };

  const handleMouseMove = (event: any) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (action === 'panning') {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY,
      });

      return;
    }

    if (tool === 'selection') {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element
        ? cursorForPosition(element.position)
        : 'default';
    }

    if (action === 'drawing') {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool, null);
    } else if (action === 'moving') {
      if (selectedElement.type === 'pencil') {
        const newPoints = selectedElement.points.map((_: any, index: any) => ({
          x: clientX - selectedElement.xOffsets[index],
          y: clientY - selectedElement.yOffsets[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[selectedElement.id] = {
          ...elementsCopy[selectedElement.id],
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        const options = type === 'text' ? { text: selectedElement.text } : {};
        updateElement(
          id,
          newX1,
          newY1,
          newX1 + width,
          newY1 + height,
          type,
          options
        );
      }
    } else if (action === 'resizing') {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 }: any = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type, null);
    }
  };

  const handleMouseUp = (event: any) => {
    // if (!drawing) return;
    // drawing = false;
    const { clientX, clientY } = getMouseCoordinates(event);
    if (selectedElement) {
      if (
        selectedElement.type === 'text' &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction('writing');
        return;
      }

      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (
        (action === 'drawing' || action === 'resizing') &&
        adjustmentRequired(type)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type, null);
        // if (!send) {
        //   return;
        // }
      }

      socketRef?.current?.send(
        JSON.stringify({
          element: elements[index],
          color: 'red',
        })
      );
    }

    if (action === 'writing') return;

    setAction('none');
    setSelectedElement(null);
  };

  const handleBlur = (event: any) => {
    const { id, x1, y1, type } = selectedElement;
    setAction('none');
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, type, { text: event.target.value });
  };

  const onZoom = (increment: any) => {
    setScale((prevState) => Math.min(Math.max(prevState + increment, 0.1), 20));
  };

  // const onDrawingEvent = (data: any) => {
  //   if (data.color) {
  //     drawLine(
  //       data.x0 * w,
  //       data.y0 * h,
  //       data.x1 * w,
  //       data.y1 * h,
  //       data.color,
  //       false
  //     );
  //   }
  // };

  return (
    <div>
      {/* <meta
        name='viewport'
        content='user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi'
      /> */}

      {/* <DisableZoom /> */}
      <Sidebar />
      <div
        style={{
          position: 'fixed',
          zIndex: 2,
        }}
      >
        <input
          type='radio'
          id='selection'
          checked={tool === 'selection'}
          onChange={() => setTool('selection')}
        />
        <label htmlFor='selection'>Selection</label>
        <input
          type='radio'
          id='line'
          checked={tool === 'line'}
          onChange={() => setTool('line')}
        />
        <label htmlFor='line'>Line</label>
        <input
          type='radio'
          id='rectangle'
          checked={tool === 'rectangle'}
          onChange={() => setTool('rectangle')}
        />
        <label htmlFor='rectangle'>Rectangle</label>
        <input
          type='radio'
          id='pencil'
          checked={tool === 'pencil'}
          onChange={() => setTool('pencil')}
        />
        <label htmlFor='pencil'>Pencil</label>
        <input
          type='radio'
          id='text'
          checked={tool === 'text'}
          onChange={() => setTool('text')}
        />
        <label htmlFor='text'>Text</label>
      </div>
      <div style={{ position: 'fixed', zIndex: 2, bottom: 0, padding: 10 }}>
        <button onClick={() => onZoom(-0.1)}>-</button>
        <span onClick={() => setScale(1)}>
          {new Intl.NumberFormat('en-GB', { style: 'percent' }).format(scale)}{' '}
        </span>
        <button onClick={() => onZoom(0.1)}>+</button>
        <span> </span>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>
      {action === 'writing' ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: 'fixed',
            top:
              (selectedElement.y1 - 2) * scale +
              panOffset.y * scale -
              scaleOffset.y,
            left:
              selectedElement.x1 * scale + panOffset.x * scale - scaleOffset.x,
            font: `${24 * scale}px sans-serif`,
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: 'both',
            overflow: 'hidden',
            whiteSpace: 'pre',
            background: 'transparent',
            zIndex: 2,
          }}
        />
      ) : null}
      <canvas
        id='canvas'
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: 'absolute', zIndex: 1 }}
      >
        Canvas
      </canvas>

      <div ref={colorsRef} className='colors'>
        <input id='color' type='color' />
      </div>
    </div>
  );
};

export default Canvas;
