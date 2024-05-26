import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import rough from 'roughjs';
import getStroke from 'perfect-freehand';
import '../scss/components/canvas.scss';
import axios from 'axios';
import Notifications from './Notifications';
import { useCookies } from 'react-cookie';
// import Language from './Language';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: location.origin,
});

// const drawPolyhedron = (x1: any, y1: any) => {
//   const points = 5;
//   const angle = (Math.PI * 2) / points;
//   const radius = 100;

//   const starPoints = [] as any;
//   for (let i = 0; i < points * 2; i++) {
//     const radians = (i / 2) * angle;
//     const x = x1 + radius * Math.cos(radians);
//     const y = y1 + radius * Math.sin(radians);
//     starPoints.push([x, y]);
//   }

//   return starPoints;
// };

const drawStar: any = (x1: any, y1: any, x2: any, y2: any, n: any) => {
  const points = [] as any;

  const centerX = x1;
  const centerY = y1;

  const outerRadius =
    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;

  const innerRadius = outerRadius / 2;
  const rotationAngle = (18 * Math.PI) / 180;

  const angleIncrement = (2 * Math.PI) / n;

  for (let i = 0; i < n; i++) {
    const angle = i * angleIncrement - rotationAngle;

    const outerX = centerX + outerRadius * Math.cos(angle);
    const outerY = centerY + outerRadius * Math.sin(angle);

    const innerAngle = angle + angleIncrement / 2;
    const innerX = centerX + innerRadius * Math.cos(innerAngle);
    const innerY = centerY + innerRadius * Math.sin(innerAngle);

    points.push([outerX, outerY]);
    points.push([innerX, innerY]);
  }

  points.push(points[0]);

  return points;
};

const generator = rough.generator();

const createElement = (
  id: any,
  x1: any,
  y1: any,
  x2: any,
  y2: any,
  type: any,
  options: any
) => {
  let roughElement: any;
  switch (type) {
    case 'line':
      roughElement = generator.line(x1, y1, x2, y2, { roughness: 0 });
      return { id, x1, y1, x2, y2, type, roughElement };
    case 'rectangle':
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
        roughness: 0,
      });
      return { id, x1, y1, x2, y2, type, roughElement };
    case 'ellipse':
      roughElement = generator.ellipse(
        x1,
        y1,
        x2 - x1 - (x1 - x2),
        y2 - y1 - (y1 - y2),
        {
          roughness: 0,
        }
      );
      return { id, x1, y1, x2, y2, type, roughElement };
    case 'triangle':
      roughElement = generator.linearPath(
        [
          [x1 - (x2 - x1), y1],
          [x2 - (x2 - x1), y2],
          [x2, y1],
          [x1 - (x2 - x1), y1],
          // [x1 + (x2 - x1), y1],
        ],
        { roughness: 0 }
      );
      return { id, x1, y1, x2, y2, type, roughElement };
    case 'star':
      roughElement = generator.linearPath(drawStar(x1, y1, x2, y2, 5), {
        roughness: 0,
      });
      return { id, x1, y1, x2, y2, type, roughElement };
    case 'pencil':
      return {
        id,
        type,
        points: [{ x: x1, y: y1 }],
        options: {
          strokeColor: options?.strokeColor,
          strokeSize: options?.strokeSize,
        },
      };
    case 'text':
      return {
        id,
        type,
        x1,
        y1,
        x2,
        y2,
        text: '',
        options: {
          fontColor: options?.fontColor,
          fontSize: options?.fontSize,
          fontFamily: options?.fontFamily,
        },
      };
    case 'image':
      return { id, type, x1, y1, x2, y2, url: '' };
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
  let topLeft: any;
  let topRight: any;
  let bottomLeft: any;
  let bottomRight: any;
  let inside: any;
  switch (type) {
    case 'line':
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, 'start');
      const end = nearPoint(x, y, x2, y2, 'end');
      return start || end || on;
    case 'rectangle':
      topLeft = nearPoint(x, y, x1, y1, 'tl');
      topRight = nearPoint(x, y, x2, y1, 'tr');
      bottomLeft = nearPoint(x, y, x1, y2, 'bl');
      bottomRight = nearPoint(x, y, x2, y2, 'br');
      inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case 'ellipse':
      topLeft = nearPoint(x, y, x1, y1, 'tl');
      topRight = nearPoint(x, y, x2, y1, 'tr');
      bottomLeft = nearPoint(x, y, x1, y2, 'bl');
      bottomRight = nearPoint(x, y, x2, y2, 'br');
      inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case 'triangle':
      topLeft = nearPoint(x, y, x1, y1, 'tl');
      topRight = nearPoint(x, y, x2, y1, 'tr');
      bottomLeft = nearPoint(x, y, x1, y2, 'bl');
      bottomRight = nearPoint(x, y, x2, y2, 'br');
      inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case 'star':
      topLeft = nearPoint(x, y, x1, y1, 'tl');
      topRight = nearPoint(x, y, x2, y1, 'tr');
      bottomLeft = nearPoint(x, y, x1, y2, 'bl');
      bottomRight = nearPoint(x, y, x2, y2, 'br');
      inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
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
    case 'image':
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
  if (
    type === 'rectangle' ||
    type === 'ellipse' ||
    type === 'triangle' ||
    type === 'star'
  ) {
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
      return null;
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
    case 'ellipse':
    case 'triangle':
    case 'star':
      context.fillStyle = element?.options?.fillColor;
      roughCanvas.draw(element.roughElement, { fill: 'red', stroke: 'red' });
      break;
    case 'pencil':
      const stroke = getSvgPathFromStroke(
        getStroke(element.points, { size: element?.options?.strokeSize })
      );
      context.fillStyle = element?.options?.strokeColor;
      context.fill(new Path2D(stroke));
      break;
    case 'text':
      context.textBaseline = 'top';
      context.font = `${element?.options?.fontSize}px ${element?.options?.fontFamily}`;
      context.fillStyle = element?.options?.fontColor;
      context.fillText(element.text, element.x1, element.y1);
      break;
    case 'image':
      context.drawImage(element.imgElement, element.x1, element.y1);
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
  const [isSpecialTools, setIsSpecialTools] = useState<any>(false);
  const [shapesToolIcon, setShapesToolIcon] = useState('shapes.svg');
  const SpecialToolsRef = useRef<HTMLDivElement>(null);
  const toolsContainerRef = useRef<HTMLDivElement>(null);
  const pencilBoxButtonRef = useRef<HTMLDivElement>(null);
  const shapeBoxButtonRef = useRef<HTMLDivElement>(null);
  const shapesBoxRef = useRef<HTMLDivElement>(null);
  const pencilBoxRef = useRef<HTMLDivElement>(null);
  // const language = Language();
  const fontInputRef = useRef<HTMLInputElement>(null);
  const [autoShapeMode, setAutoShapeMode] = useState(false);
  const [isShapeBox, setIsShapeBox] = useState<boolean>(false);
  const [isPencilBox, setIsPencilBox] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasMiniRef = useRef<HTMLCanvasElement>(null);
  const [modelML5, setModelML5] = useState<any>(null);
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState('none');
  const [tool, setTool] = useState('rectangle');
  const [selectedElement, setSelectedElement] = useState(null) as any;
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });
  const [innnerSize, setInnnerSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaAdditionalContainerRef = useRef<HTMLDivElement>(null);
  const pressedKeys = usePressedKeys();
  const colorsRef = useRef<HTMLDivElement>(null);
  const [canvasData, setCanvasData] = useState<any>({});

  const [strokeSize, setStrokeSize] = useState(15);
  const [strokeColor, setStrokeColor] = useState('#20190c');
  // const [_, _] = useState('times_new_roman');
  const [fontColor, setFontColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Times New Roman');
  const [backGroundColor, setBackGroundColor] = useState('#f0f0f0');
  const [demoMode, setDemoMode] = useState(false);
  const [preventDefault, setPreventDefault] = useState(false);

  const [permission, setPermission] = useState(false);

  const [default_fonts, setDefaultFonts] = useState([
    { family: 'Times New Roman' },
    { family: 'Arial' },
    { family: 'Helvetica' },
    { family: 'Verdana' },
    { family: 'Georgia' },
    { family: 'Garamond' },
    { family: 'Courier New' },
    { family: 'Brush Script MT' },
  ]);
  const [fonts, setFonts] = useState<any>(default_fonts);
  const fontSizes = [
    12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48,
    50,
  ];

  const [userData, setUserData] = useState<any>({});

  useLayoutEffect(() => {
    client.get(`/api/user/`).then((e) => {
      client.patch(`/api/user-profile/${e.data.user.profile.pk}/`, {
        online: true,
      });

      setUserData(e.data.user);
      console.log(e.data.user);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        shapeBoxButtonRef.current &&
        !shapeBoxButtonRef.current.contains(event.target)
      ) {
        setIsShapeBox(false);
      }

      if (
        toolsContainerRef.current &&
        toolsContainerRef.current.contains(event.target) &&
        !pencilBoxButtonRef.current?.contains(event.target) &&
        !pencilBoxRef.current?.contains(event.target)
      ) {
        setIsPencilBox(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isShapeBox, isPencilBox]);

  function sortDefaultFontsByFamily(
    fonts: { family: string }[]
  ): { family: string }[] {
    return fonts.sort((a, b) => a.family.localeCompare(b.family));
  }

  useLayoutEffect(() => {
    const sortedFonts = sortDefaultFontsByFamily(default_fonts);
    setDefaultFonts(sortedFonts);
  }, [default_fonts]);

  const [, setImgData] = useState<string>();

  const [cookies, setCookie] = useCookies([
    'strokeColor',
    'strokeSize',
    'tool',
    'panOffset',
    'scale',
    'fontColor',
    'fontSize',
    'fontFamily',
    'zoomIndex',
    'gridType',
    'backGroundColor',
    'autoShapeMode',
  ]);
  function youtube_parser(url: any) {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }

  useEffect(() => {
    const pasteImg = async () => {
      try {
        const clipboardItems = await navigator.clipboard.read();
        if (clipboardItems.length > 0) {
          const clipboardItem = clipboardItems[0];
          const types = await clipboardItem.types;
          if (
            types.includes('image/png') ||
            types.includes('image/jpeg') ||
            types.includes('image/jpg') ||
            types.includes('image/gif') ||
            types.includes('image/webp')
          ) {
            const blobOutput =
              (await clipboardItem.getType('image/png')) ||
              (await clipboardItem.getType('image/jpeg')) ||
              (await clipboardItem.getType('image/jpg')) ||
              (await clipboardItem.getType('image/gif')) ||
              (await clipboardItem.getType('image/webp'));

            const data = URL.createObjectURL(blobOutput);
            const imgElement = new Image();
            imgElement.src = data;
            imgElement.crossOrigin = 'anonymous';

            imgElement.onload = () => {
              setImgData(data);
              setElements([
                ...elements,
                {
                  type: 'image',
                  imgElement,
                  x1:
                    window.innerWidth / 2 - panOffset.x - imgElement.width / 2,
                  y1:
                    window.innerHeight / 2 -
                    panOffset.y -
                    imgElement.height / 2,
                },
              ]);
            };
          } else if (types.includes('text/plain')) {
            const text = await navigator.clipboard.readText();
            const domain = new URL(text).hostname;
            console.log(domain);
            const iframe = document.createElement('iframe');
            const youtubeID = `https://www.youtube.com/embed/${youtube_parser(
              text
            )}`;
            iframe.src = youtubeID;
            // iframe.style.display = 'none';
            iframe.style.position = 'absolute';
            iframe.style.zIndex = '300';
            iframe.style.top = '100px';
            iframe.height = 'auto';
            iframe.width = 'auto';
            document.body.appendChild(iframe);

            // setElements([
            //   ...elements,
            //   {
            //     type: 'iframe',
            //     iframe,
            //     x1: window.innerWidth / 2 - panOffset.x,
            //     y1: window.innerHeight / 2 - panOffset.y,
            //   },
            // ]);
            // setElements([
            //   ...elements,
            //   {
            //     type: 'text',
            //     text,
            //     x1: window.innerWidth / 2 - panOffset.x,
            //     y1: window.innerHeight / 2 - panOffset.y,
            //   },
            // ]);
          }
        } else {
          console.log('No clipboard items found');
        }
      } catch (e) {
        console.log(e);
      }
    };
    window.addEventListener('paste', pasteImg, false);

    return () => {
      window.removeEventListener('paste', pasteImg, false);
    };
  }, [panOffset, elements]);

  useLayoutEffect(() => {
    document.getElementsByTagName('html')[0].style.overflow = 'hidden';
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    document.getElementsByTagName('html')[0].style.touchAction = 'none';
    document.getElementsByTagName('body')[0].style.userSelect = 'none';
  }, []);

  useLayoutEffect(() => {
    if (cookies.strokeSize) setStrokeSize(cookies.strokeSize);
    if (cookies.strokeColor) setStrokeColor(cookies.strokeColor);
    if (cookies.tool) setTool(cookies.tool);
    if (cookies.panOffset) setPanOffset(cookies.panOffset);
    if (cookies.scale) setScale(cookies.scale);
    if (cookies.fontColor) setFontColor(cookies.fontColor);
    if (cookies.fontSize) setFontSize(cookies.fontSize);
    if (cookies.fontFamily) setFontFamily(cookies.fontFamily);
    if (cookies.zoomIndex) setZoomIndex(cookies.zoomIndex);
    if (cookies.gridType) setGridType(cookies.gridType);
    if (cookies.backGroundColor) setBackGroundColor(cookies.backGroundColor);
    if (cookies.autoShapeMode) setAutoShapeMode(cookies.autoShapeMode);
  }, []);

  const onResize = () => {
    setInnnerSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  useEffect(() => {
    window.addEventListener('resize', onResize, false);
    onResize();
    return () => {
      window.removeEventListener('resize', onResize, false);
    };
  }, [scale]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const contextMenu = (e: any) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', contextMenu);
    return () => {
      window.removeEventListener('contextmenu', contextMenu);
    };
  }, []);

  const onStrokeColorUpdate = (e: any) => {
    setStrokeColor(e.target.value);
    setCookie('strokeColor', e.target.value, { path: pageURL });
  };

  const onFontColorUpdate = (e: any) => {
    setFontColor(e.target.value);
    setCookie('fontColor', e.target.value, { path: pageURL });
  };

  const handleToolChange = (tool: any) => {
    setTool(tool);
    setCookie('tool', tool, { path: pageURL });
  };

  var wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

  const strokeColorElement = colorsRef.current?.querySelector('#stroke-color');
  const fontColorElement = colorsRef.current?.querySelector('#font-color');

  strokeColorElement?.addEventListener('change', onStrokeColorUpdate, false);
  fontColorElement?.addEventListener('change', onFontColorUpdate, false);

  const slug = window.location.pathname.split('/')[2];
  const pageURL = `/canvas/${slug}`;

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cursor = document.querySelector('.circular-cursor');

    const onMouseMove = (e: MouseEvent) => {
      cursor?.setAttribute(
        'style',
        `left: ${e.pageX - 3 * scale}px; top: ${
          e.pageY - 2 * scale
        }px; width: ${5 * scale}px; height: ${5 * scale}px;`
      );
    };

    onMouseMove(new MouseEvent('mousemove'));

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [scale]);

  const [data, setData] = useState({});
  const [isModalWindowRequest, setIsModalWindowRequest] =
    useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const socketRequestRef = useRef<WebSocket | null>(null);
  const [canvasRequestUserID, setCanvasRequestUserID] = useState<any>(null);

  const [isAccess, setIsAccess] = useState<boolean>(false);

  useLayoutEffect(() => {
    client
      .get(`/api/canvas/${slug}/`)
      .then((e) => {
        setCanvasData(e.data.canvas);
        setData(e.data.elements);
        console.log(e.data.canvas);
      })
      .catch((e) => {
        if (e.response.status === 404) {
          setIsNotFound(true);
        } else if (e.response.status === 403) {
          setIsModalWindowRequest(true);
          console.log(e.response.data[0][0]);
          const websocket_url = `${wsProtocol}://${location.host}/user/${e.response.data[0][0]}/`;
          console.log(websocket_url);
          socketRequestRef.current = new WebSocket(websocket_url);
          socketRequestRef.current.onopen = () => {
            console.log('socket request open');
          };
          socketRequestRef.current.onclose = () => {
            console.log('socket request close');
          };
          socketRequestRef.current.onerror = () => {
            console.log('socket request error');
          };
          setCanvasRequestUserID(e.response.data[0][0]);
        }
      });
  }, [isAccess]);

  useEffect(() => {
    setInterval(() => {
      setIsAccess(true);
    }, 3000);
  }, [isAccess]);

  const handleAccessRequest = () => {
    socketRequestRef!.current!.send(
      JSON.stringify({
        type: 'requestAccess',
        recipientID: canvasRequestUserID,
        senderID: userData.id,
        canvasSlug: window.location.pathname.split('/')[2],
      })
    );
  };

  const [voiceRecord, setVoiceRecord] = useState<boolean>(false);

  const handleVoiceRecordChange = (e: any) => {
    setVoiceRecord(e.target.checked);
  };

  useEffect(() => {
    let mediaRecorder: any;
    let stream: MediaStream;

    if (voiceRecord) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((userStream) => {
            stream = userStream;
            mediaRecorder = new MediaRecorder(stream) as any;

            let chunks: any[] = [];
            mediaRecorder.ondataavailable = (e: any) => {
              chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
              const audioBlob = new Blob(chunks, { type: 'audio/webm' });
              chunks = [];
              const audioSrc = URL.createObjectURL(audioBlob);
              const audio = new Audio(audioSrc);
              audio.play();
              const formData = new FormData();
              formData.append('file', audioBlob);
              formData.append('name', 'voice');
              client.post('/api/file/', formData);
              console.log(audioSrc);
            };

            mediaRecorder.start();
          })
          .catch((error) => {
            console.error('Error accessing audio stream:', error);
          });
      } else {
        console.log('getUserMedia not supported');
      }
    }

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [voiceRecord]);

  useLayoutEffect(() => {
    const dataMap = new Map(Object.entries(data));
    const el = [];
    for (let elem of dataMap) {
      let e = elem[1] as any;
      el.push(e.element);
    }
    setElements(el, true);
  }, [data]);

  useLayoutEffect(() => {
    if (!permission) return;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ratio = window.devicePixelRatio;
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    canvas?.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
    const context = canvas?.getContext('2d');
    const roughCanvas = rough.canvas(canvas!);

    context!.clearRect(0, 0, canvas.width, canvas.height);

    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;

    const scaleOffsetX = (scaledWidth - canvas.width / ratio) / 2;
    const scaleOffsetY = (scaledHeight - canvas.height / ratio) / 2;
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
  }, [
    elements,
    action,
    selectedElement,
    panOffset,
    scale,
    innnerSize,
    fonts,
    permission,
    canvasData,
  ]);

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

  const handleWheel = (event: any) => {
    event.preventDefault();
    if (preventDefault) return;
    if (event.ctrlKey || event.metaKey) {
      // console.log(scale);
      // onZoom(0.1);
      setScale((prev) => prev - 0.05 * Math.sign(event.deltaY));
    } else {
      setPanOffset((prev) => ({
        x: prev.x - event.deltaX / scale,
        y: prev.y - event.deltaY / scale,
      }));
      // const cursor = document.querySelector('.cursor_container') as HTMLElement;
      // cursor.style.transform = `translate(${10}px, ${10}px)`;
    }
  };

  useEffect(() => {
    canvasRef!.current!.addEventListener('wheel', handleWheel, {
      passive: false,
    } as AddEventListenerOptions);
    return () => {
      canvasRef!.current!.removeEventListener('wheel', handleWheel, {
        passive: false,
      } as AddEventListenerOptions);
    };
  }, [panOffset]);

  function shadeColor(color: string, percent: number) {
    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = (R * (100 + percent)) / 100;
    G = (G * (100 + percent)) / 100;
    B = (B * (100 + percent)) / 100;

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    R = Math.round(R);
    G = Math.round(G);
    B = Math.round(B);

    var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
    var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
    var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

    return '#' + RR + GG + BB;
  }

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--dot-space',
      `${50 * scale}px`
    );
    document.documentElement.style.setProperty(
      '--dot-x',
      `${panOffset.x * scale}px`
    );
    document.documentElement.style.setProperty(
      '--dot-y',
      `${panOffset.y * scale}px`
    );

    document.documentElement.style.setProperty(
      '--dot-color',
      `${shadeColor(backGroundColor, -20)}`
    );
  }, [scale, panOffset, backGroundColor]);

  const loadingRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    switch (tool) {
      case 'ellipse':
        setShapesToolIcon('circle.svg');
        break;
      case 'rectangle':
        setShapesToolIcon('square.svg');
        break;
      case 'triangle':
        setShapesToolIcon('triangle.svg');
        break;
      case 'star':
        setShapesToolIcon('star.svg');
        break;
      case 'line':
        setShapesToolIcon('line.svg');
        break;
      default:
        setShapesToolIcon('shapes.svg');
        break;
    }
  }, [tool]);

  useLayoutEffect(() => {
    if (!permission) {
      loadingRef!.current!.style.opacity = '1';
      canvasRef!.current!.style.display = 'none';
    } else {
      const toolSelection = document.querySelector(
        '.sidebar-tools-container'
      ) as HTMLInputElement;
      const canvasHeader = document.querySelector(
        '.canvas-header-right-container '
      ) as HTMLInputElement;
      const reactionChooseContainer = document.querySelector(
        '.reaction-choose-container'
      );
      const zoomContainer = document.querySelector(
        '.zoom-container'
      ) as HTMLInputElement;
      const logoContainer = document.querySelector(
        '.logo-container'
      ) as HTMLInputElement;
      toolSelection!.classList.add('loading');
      canvasHeader!.classList.add('loading');
      reactionChooseContainer!.classList.add('loading');
      zoomContainer!.classList.add('loading');
      logoContainer!.classList.add('loading');

      setTimeout(() => {
        canvasRef!.current!.style.display = 'unset';
        loadingRef!.current!.style.opacity = '0';

        setTimeout(() => {
          loadingRef!.current!.style.display = 'none';
          toolSelection!.classList.remove('loading');
          canvasHeader!.classList.remove('loading');
          reactionChooseContainer!.classList.remove('loading');
          zoomContainer!.classList.remove('loading');
          logoContainer!.classList.remove('loading');
        }, 1500);
      }, 1500);
    }
  }, [permission]);

  const panOrZoomFunction = (event: any) => {
    if (preventDefault) return;
    if (pressedKeys.has('Control')) onZoom(event.deltaY * -0.01);
    else {
      setPanOffset((prev) => ({
        x: prev.x - event.deltaX,
        y: prev.y - event.deltaY,
      }));
    }
  };

  useEffect(() => {
    canvasRef!.current!.addEventListener('wheel', panOrZoomFunction, {
      passive: false,
    } as AddEventListenerOptions);
    return () => {
      canvasRef!.current!.removeEventListener('wheel', panOrZoomFunction, {
        passive: false,
      } as AddEventListenerOptions);
    };
  }, [panOffset]);

  useEffect(() => {
    const websocket_url = `${wsProtocol}://${location.host}/canvas/${slug}/`;
    socketRef.current = new WebSocket(websocket_url);

    socketRef!.current!.onclose = () => {
      console.log('socket closed');
    };

    socketRef.current!.onerror = () => {
      console.log('socket error');
    };
  }, []);

  const onMouseMove = useCallback(
    (e: any) => {
      const { clientX, clientY } = getMouseCoordinates(e);
      socketRef!.current!.send(
        JSON.stringify({
          type: 'cursorMove',
          id: userData.id,
          userid: userData.id,
          x: clientX,
          y: clientY,
        })
      );
    },
    [panOffset, userData, scale]
  );

  const throttle = (callback: any, delay: any) => {
    let previousCall = new Date().getTime();
    return function () {
      const time = new Date().getTime();
      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  useEffect(() => {
    const handleMouseMove = throttle(onMouseMove, 125);
    canvasRef!.current!.addEventListener('mousemove', handleMouseMove, false);
    return () => {
      canvasRef!.current!.removeEventListener('mousemove', handleMouseMove);
    };
  }, [panOffset, userData, scale]);

  const [currentX] = useState(0);
  const [currentY] = useState(0);
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);
  // const ease = 0.1;
  useEffect(() => {
    let cursor: any;
    // const cursorAvatar = document.querySelector(
    //   '.cursor_avatar'
    // ) as HTMLImageElement;

    // const run = () => {
    //   requestAnimationFrame(run);
    //   setCurrentX((prev) => prev + (targetX - prev) * ease);
    //   setCurrentY((prev) => prev + (targetY - prev) * ease);
    //   const t = `translate3d(${currentX}px,${currentY}px,0px)`;
    //   let s = cursor.style;

    //   s['transform'] = t;
    // };
    // run();

    const handleCursorMessage = (event: any) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.type === 'cursorMove') {
        if (data.userid !== userData.id) {
          cursor = document.querySelectorAll(
            '.cursor_container'
          )[0] as HTMLElement;
          console.log(cursor);
          // const user = canvasData.permitted_users.find(
          //   (user: any) => user.id === data.id
          // );
          // cursorAvatar.src = user!.avatar;
          // console.log(data);
          setTargetX(data.x + panOffset.x - scaleOffset.x);
          setTargetY(data.y + panOffset.y - scaleOffset.y);
        }
      }
    };

    // socketRef!.current!.addEventListener('message', handleCursorMessage, false);

    return () => {
      socketRef!.current!.removeEventListener(
        'message',
        handleCursorMessage,
        false
      );
    };
  }, [
    panOffset,
    canvasData,
    scale,
    scaleOffset,
    targetX,
    targetY,
    currentX,
    currentY,
  ]);

  useEffect(() => {
    const Unload = async () => {
      if (socketRef!.current!.readyState === 1) {
        // await client.patch(`/api/user-profile/${userData.profile.pk}/`, {
        //   online: true,
        // });
        socketRef!.current!.send(
          JSON.stringify({
            type: 'join',
            avatar: userData.avatar,
            email: userData.email,
          })
        );
      }
    };

    const BeforeUnload = async () => {
      if (!userData) return;
      client.patch(`/api/user-profile/${userData.profile.pk}/`, {
        online: false,
      });
      socketRef!.current!.send(
        JSON.stringify({
          type: 'leave',
          avatar: userData.avatar,
          email: userData.email,
        })
      );
    };

    const VisibilityChange = (event: any) => {
      if (event.type === 'visibilitychange') {
        if (document.visibilityState === 'hidden') {
          BeforeUnload();
        }
        if (document.visibilityState === 'visible') {
          Unload();
        }
      }
    };

    window.addEventListener('unload', Unload);
    window.addEventListener('beforeunload', BeforeUnload);
    window.addEventListener('beforeclose', BeforeUnload);
    window.addEventListener('visibilitychange', VisibilityChange);
    window.addEventListener('reopen', Unload);
    window.addEventListener('blur', BeforeUnload);
    window.addEventListener('focus', Unload);
    window.addEventListener('pagehide', BeforeUnload);
    window.addEventListener('pageshow', Unload);

    Unload();

    return () => {
      window.removeEventListener('beforeunload', () => {});
      window.removeEventListener('visibilitychange', VisibilityChange);
      window.removeEventListener('unload', Unload);
      window.removeEventListener('beforeclose', BeforeUnload);
      window.removeEventListener('reopen', Unload);
      window.removeEventListener('blur', BeforeUnload);
      window.removeEventListener('focus', Unload);
      window.removeEventListener('pagehide', BeforeUnload);
      window.removeEventListener('pageshow', Unload);
    };
  }, [socketRef, userData]);
  const [onlineMembers, setOnlineMembers] = useState<any>([]);

  useLayoutEffect(() => {
    if (!canvasData.permitted_users) return;

    for (let i = 0; i < canvasData.permitted_users.length; i++) {
      if (
        canvasData.permitted_users[i].profile.online ||
        canvasData.permitted_users[i].id == userData.id
      ) {
        try {
          if (
            !onlineMembers.some(
              (member: any) =>
                member.email === canvasData.permitted_users[i].email
            )
          )
            setOnlineMembers((prevState: any) => [
              ...prevState,
              {
                email: canvasData.permitted_users[i].email,
                avatar: canvasData.permitted_users[i].avatar,
              },
            ]);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }, [canvasData, onlineMembers, userData]);

  const [reactions, setReactions] = useState<any>([]);

  // const timeout = setTimeout(() => {
  //   setReactions([]);
  // }, 4000);

  useEffect(() => {
    // return () => {
    //   clearTimeout(timeout);
    // };
  }, [reactions]);

  useEffect(() => {
    const handleWebsocketOpen = (event: any) => {
      console.log('open', event);
    };
    socketRef!.current!.addEventListener('open', handleWebsocketOpen, false);

    const handleMessage = (event: any) => {
      const data = JSON.parse(event.data);
      if (data.type === 'reaction') {
        const reaction = { id: data.userid, src: data.src };
        setReactions((prevState: any) => [...prevState, reaction]);
      }
      if (data.type === 'demoScreen' && data.userid !== userData.id) {
        setPanOffset({ x: data.panOffset.x, y: data.panOffset.y });
        setScale(data.scale);
      }
      if (data.type === 'demo' && data.userid !== userData.id) {
        setPreventDefault(data.status);
      }
      if (data.type === 'leave' && data.email !== userData.email) {
        setOnlineMembers((prevState: any) =>
          prevState.filter((member: any) => member.email !== data.email)
        );
      }
      if (data.type === 'join' && data.email !== userData.email) {
        const member = onlineMembers.find(
          (member: any) => member.email === data.email
        );
        if (!member)
          setOnlineMembers((prevState: any) => [
            ...prevState,
            { email: data.email, avatar: data.avatar },
          ]);
      }
      if (data.type === 'elementUpdate' && data.userid !== userData.id) {
        setElements((prevState: any) => [...prevState, data.element], true);
      }
    };

    socketRef!.current!.addEventListener('message', handleMessage, false);

    return () => {
      socketRef!.current!.removeEventListener('message', handleMessage, false);
      socketRef!.current!.removeEventListener(
        'open',
        handleWebsocketOpen,
        false
      );
    };
  }, [elements, userData, onlineMembers, reactions]);

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
      case 'ellipse':
      case 'triangle':
      case 'star':
        // const { strokeSize, strokeColor } = options;
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type, {
          strokeSize: strokeSize,
          strokeColor: strokeColor,
        });
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
                type,
                {
                  fontColor: fontColor,
                  fontSize: fontSize,
                  fontFamily: fontFamily,
                }
              ),
              text: options.text,
              fontColor: options.fontColor,
              fontSize: options.fontSize,
              fontFamily: options.fontFamily,
            };
          }
        }

        if (
          !default_fonts.some(
            (font: any) => font.family === elementsCopy[id].options.fontFamily
          )
        )
          if (
            !canvasData.fonts.some(
              (font: any) => font.name === elementsCopy[id].options.fontFamily
            )
          ) {
            client
              .patch(`/api/canvas/update/${slug}/`, {
                font: elementsCopy[id].options.fontFamily,
              })
              .then(
                (response) => {
                  console.log(response);
                },
                (error) => {
                  console.log(error);
                }
              );
          }

        client.patch(`/api/canvas/${slug}/`, {
          element: elementsCopy[id],
        });
        socketRef?.current?.send(
          JSON.stringify({
            userid: userData.id,
            type: 'elementUpdate',
            element: elementsCopy[id],
          })
        );
        break;
      case 'image':
        elementsCopy[id] = {
          ...createElement(id, x1, y1, x2, y2, type, { url: options.url }),
          url: options.url,
        };

        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }

    setElements(elementsCopy, true);
  };

  const getMouseCoordinates = (event: any) => {
    const clientX =
      (((event.clientX && event.clientX) ||
        (event.changedTouches &&
          event.changedTouches[0] &&
          event.changedTouches[0].clientX) ||
        (event.touches && event.touches[0] && event.touches[0].clientX)) -
        panOffset.x * scale +
        scaleOffset.x) /
      scale;
    const clientY =
      (((event.clientY && event.clientY) ||
        (event.changedTouches &&
          event.changedTouches[0] &&
          event.changedTouches[0].clientY) ||
        (event.touches && event.touches[0] && event.touches[0].clientY)) -
        panOffset.y * scale +
        scaleOffset.y) /
      scale;
    return { clientX, clientY };
  };

  // const getMouseCoordinates = (event: any) => {
  //   const clientX =
  //     ((event.clientX ||
  //       event.changedTouches[0].clientX ||
  //       event.touches[0].clientX) -
  //       panOffset.x * scale +
  //       scaleOffset.x) /
  //     scale;
  //   const clientY =
  //     ((event.clientY ||
  //       event.changedTouches[0].clientY ||
  //       event.touches[0].clientY) -
  //       panOffset.y * scale +
  //       scaleOffset.y) /
  //     scale;
  //   return { clientX, clientY };
  // };

  const handleStrokeSizeChange = (event: any) => {
    setStrokeSize(parseInt(event.target.value));
    setCookie('strokeSize', event.target.value, { path: pageURL });
  };

  // const handleFontSizeChange = (event: any) => {
  //   setFontSize(parseInt(event.target.value));
  //   setCookie('fontSize', event.target.value, { path: pageURL });
  // };

  const handleFontColorChange = (event: any) => {
    setFontColor(event.target.value);
    setCookie('fontColor', event.target.value, { path: pageURL });
  };

  const handleMouseDown = (event: any) => {
    if (preventDefault) return;
    if (event.touches && event.touches.length > 1) return;
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
        tool,
        { strokeColor: strokeColor, strokeSize: strokeSize }
      );
      setElements((prevState: any) => [...prevState, element]);
      setSelectedElement(element);

      setAction(tool === 'text' ? 'writing' : 'drawing');
    }
  };

  const handleMouseMove = (event: any) => {
    if (preventDefault) return;
    if (event.touches && event.touches.length > 1) return;
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
        const options =
          type === 'text'
            ? {
                text: selectedElement.text,
              }
            : {};
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

  const zoomValues = [
    0, 0.01, 0.01, 0.02, 0.05, 0.05, 0.05, 0.13, 0.17, 0.25, 0.25, 0.25, 0.5,
    0.5, 0.5, 1, 1, 0,
  ];
  const [zoomIndex, setZoomIndex] = useState(10);
  const onZoomPlus = () => {
    if (zoomIndex === zoomValues.length - 1) return;
    setZoomIndex((prevIndex) => prevIndex + 1);
    setCookie('zoomIndex', zoomIndex + 1, { path: pageURL });
    onZoom(zoomValues[zoomIndex]);
  };

  const onZoomMinus = () => {
    if (zoomIndex === 0) return;
    setZoomIndex((prevIndex) => prevIndex - 1);
    setCookie('zoomIndex', zoomIndex - 1, { path: pageURL });
    onZoom(-zoomValues[zoomIndex]);
  };

  const modelLoaded = () => {
    console.log('ModelML5 Loaded');
  };

  const loadModel = async () => {
    try {
      const options = {
        task: 'imageClassification',
      };
      // @ts-ignore
      const ShapeClassifier = ml5.neuralNetwork(options);
      const modelDetails = {
        model: '/static/model/model.json',
        metadata: '/static/model/model_meta.json',
        weights: '/static/model/model.weights.bin',
      };

      ShapeClassifier.load(modelDetails, modelLoaded);
      setModelML5(ShapeClassifier);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/ml5@0.12.2/dist/ml5.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      loadModel();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [_, setShapeRecognitionResult] = useState(null);

  const handleMouseUp = (event: any) => {
    if (preventDefault) return;
    if (event.touches && event.touches.length > 1) return;
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
      }
      try {
        client.patch(`/api/canvas/${slug}/`, {
          element: elements[index],
        });
      } catch (error) {
        console.error(error);
      }
      try {
        socketRef?.current?.send(
          JSON.stringify({
            userid: userData.id,
            type: 'elementUpdate',
            element: elements[index],
          })
        );
      } catch (error) {
        console.log(error);
      }
      if (tool === 'pencil' && autoShapeMode) {
        const canvasMini = canvasMiniRef.current;
        const ctxMini = canvasMini?.getContext('2d');
        const roughCanvasMini = rough.canvas(canvasMini!);

        ctxMini?.clearRect(0, 0, canvasMini!.width, canvasMini!.height);
        ctxMini!.fillStyle = '#fff';
        ctxMini!.fillRect(0, 0, canvasMini!.width, canvasMini!.height);
        ctxMini!.fillStyle = '#000';
        const elemCopy = structuredClone(elements[index]);
        let maxX = 0;
        let maxY = 0;
        let minX = Infinity;
        let minY = Infinity;
        elemCopy.points.forEach((point: any) => {
          maxX = Math.max(maxX, point.x);
          maxY = Math.max(maxY, point.y);
        });

        elemCopy.points.forEach((point: any) => {
          minX = Math.min(minX, point.x);
          minY = Math.min(minY, point.y);
        });

        let distanceX = maxX - minX;
        let distanceY = maxY - minY;
        const resizeK = Math.max(distanceX / 42, distanceY / 42);
        elemCopy.options.strokeSize = 5;
        elemCopy.options.strokeColor = '#000';
        elemCopy.options.fill = '#000000';
        elemCopy.points = elemCopy.points.map((point: any, _: any) => ({
          x:
            (point.x +
              panOffset.x -
              scaleOffset.x -
              (minX + panOffset.x - scaleOffset.x)) /
              resizeK +
            11,
          y:
            (point.y +
              panOffset.y -
              scaleOffset.y -
              (minY + panOffset.y - scaleOffset.y)) /
              resizeK +
            11,
        }));

        drawElement(roughCanvasMini, ctxMini!, elemCopy);

        const canvasMiniImage = new Image();
        canvasMiniImage.src = canvasMini!.toDataURL('image/jpeg', 1.0);
        canvasMiniImage.onload = () => {
          modelML5?.classify({ image: canvasMiniImage }, gotResults);
        };
      }
    }

    const gotResults = (err: any, results: any) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(results[0].label, results[0].confidence);
      if (results[0].confidence < 0.85) return;
      setShapeRecognitionResult(results[0].label);
      if (results[0].label) {
        const el = elements[elements.length - 1];
        let maxX = 0;
        let maxY = 0;
        let minX = Infinity;
        let minY = Infinity;
        el.points.forEach((point: any) => {
          maxX = Math.max(maxX, point.x);
          maxY = Math.max(maxY, point.y);
        });

        el.points.forEach((point: any) => {
          minX = Math.min(minX, point.x);
          minY = Math.min(minY, point.y);
        });
        const x1 = minX;
        const y1 = minY;
        const x2 = maxX;
        const y2 = maxY;
        let type: any;
        switch (results[0].label) {
          case 'square':
            type = 'rectangle';
            break;
          case 'circle':
            type = 'ellipse';
            break;
          case 'triangle':
            type = 'triangle';
            break;
          case 'star':
            type = 'star';
            break;
        }
        let newElement: any;
        switch (type) {
          case 'rectangle':
            newElement = createElement(el.id, x1, y2, x2, y1, type, el.options);
            break;
          case 'ellipse':
            newElement = createElement(
              el.id,
              x1 - (x1 - x2) / 2,
              y1 - (y1 - y2) / 2,
              x2 + (x1 - x2) / 2 + (x1 - x2) / 2,
              y2 + (y1 - y2) / 2 + (y1 - y2) / 2,
              type,
              el.options
            );
            break;
          case 'triangle':
            newElement = createElement(
              el.id,
              x1 + (x2 - x1) / 2,
              y2,
              x2 + (x2 - x1) / 2 + (x1 - x2) / 2,
              y1,
              type,
              el.options
            );
            break;
          case 'star':
            newElement = createElement(
              el.id,
              x1 + (x2 - x1) / 2,
              y2,
              x2 + (x2 - x1) / 2 + (x1 - x2) / 2,
              y1,
              type,
              el.options
            );
            break;
        }

        elements[elements.length - 1] = newElement;
        setElements((prevState: any) => [...prevState], true);
      }
    };

    if (action === 'writing') return;

    setAction('none');
    setSelectedElement(null);

    setCookie(
      'panOffset',
      { x: panOffset.x, y: panOffset.y },
      { path: pageURL }
    );
  };

  const [modalCanvasSettings, setModalCanvasSettings] = useState(false);

  useEffect(() => {
    if (action === 'writing') {
      let isFirstClick = true;

      const handleClickOutsideSettings = (event: any) => {
        if (isFirstClick) {
          isFirstClick = false;
          return;
        }

        if (textAreaAdditionalContainerRef.current?.contains(event.target)) {
          textAreaRef.current?.focus();
          return;
        }
        if (selectedElement) {
          const { id, x1, y1, type } = selectedElement;
          setAction('none');
          setSelectedElement(null);
          updateElement(id, x1, y1, null, null, type, {
            text: textAreaRef.current?.value,
          });
        }
      };

      window.addEventListener('click', handleClickOutsideSettings);

      return () => {
        window.removeEventListener('click', handleClickOutsideSettings);
      };
    }
  }, [action, selectedElement, fontColor, fontSize, fontFamily]);

  const onZoom = (increment: number) => {
    // const targetScale = Math.min(Math.max(scale + increment, 0.01), 5);
    const targetScale = scale + increment;
    setCookie('scale', targetScale, { path: pageURL });
    const duration = 100;
    const startTime = performance.now();

    const zoomAnimation = (timestamp: any) => {
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const currentScale = scale + (targetScale - scale) * progress;

      setScale(currentScale);

      if (progress < 1) {
        requestAnimationFrame(zoomAnimation);
      } else {
        setScale(targetScale);
      }
    };

    requestAnimationFrame(zoomAnimation);
  };

  const [gridType, setGridType] = useState('lined');

  const onGridTypeChange = (value: any) => {
    setCookie('gridType', value, { path: pageURL });
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    canvas.classList.remove('dotted-grid');
    canvas.classList.remove('lined-grid');
    switch (value) {
      case 'lined':
        canvas.classList.add('lined-grid');
        break;
      case 'dotted':
        canvas.classList.add('dotted-grid');
        break;
    }
  };

  useLayoutEffect(() => {
    onGridTypeChange(gridType);
  }, [gridType]);

  const uploadFontFamily = (event: any) => {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    formData.append('name', event.target.files[0].name);
    client.post('/api/font/', formData).then(
      () => {
        // console.log(response);
        // setFontFamily(event.target.files[0].name);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get('/api/font/');
        const userFonts = response.data;
        const fonts_data = [...canvasData.fonts, ...userFonts];
        const uniqueFontsData = fonts_data.filter(
          (value: any, index: any, self: any) =>
            index ===
            self.findIndex(
              (t: any) => t.name === value.name && t.file === value.file
            )
        );
        const fontsToLoad = uniqueFontsData.length;
        let fontsLoaded = 0;
        if (fontsToLoad === 0) {
          setPermission(true);
        }
        for (let i = 0; i < uniqueFontsData.length; i++) {
          const loadFont = async () => {
            try {
              const fontFace = new FontFace(
                `${uniqueFontsData[i].name}`,
                `url(/media/fonts/${uniqueFontsData[i].file.slice(7)})`
              );
              await fontFace.load();
              document.fonts.add(fontFace);
              //check if font in userFonts
              const isUserFont = userFonts.some(
                (font: any) =>
                  font.name === uniqueFontsData[i].name &&
                  font.file === uniqueFontsData[i].file
              );
              if (isUserFont) {
                setFonts((prevUserFonts: any) => [...prevUserFonts, fontFace]);
              }

              // setFonts((prevFonts: any) => [...prevFonts, fontFace]);
              fontsLoaded++;
              if (fontsLoaded === fontsToLoad) {
                setPermission(true);
              }
            } catch (error) {
              console.error('Font loading error:', error);
            }
          };

          loadFont();
        }
        //wait for fonts to load
      } catch (error) {
        // console.log(error);
      }
    };

    fetchData();
  }, [canvasData]);

  const modalCanvasSettingsRef = useRef<HTMLDivElement>(null);

  const [isSliderStrokeShow, setIsSliderStrokeShow] = useState(false);

  const sendReaction = (reaction: any) => {
    const reactionSrc = reaction.target.getElementsByTagName('object')[0].data;
    socketRef!.current!.send(
      JSON.stringify({
        type: 'reaction',
        src: reactionSrc,
        userid: userData.id,
      })
    );
  };
  const errorAlertRef = useRef<HTMLDivElement>(null);
  const [subscription, setSubscription] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string>('');

  useEffect(() => {
    if (errorAlert) {
      errorAlertRef!.current!.classList.remove('hidden');
      setTimeout(() => {
        errorAlertRef!.current!.classList.add('hidden');
        setTimeout(() => {
          setErrorAlert('');
        }, 500);
      }, 3000);
    }
  }, [errorAlert]);

  useLayoutEffect(() => {
    if (!userData.profile) return;
    if (!userData.profile.subscription) return;
    const expiry = new Date(userData.profile.subscription.expires_at);
    const currentTime = new Date();
    const time_to_expire = expiry.getTime() - currentTime.getTime();
    if (time_to_expire > 0) {
      setSubscription(true);
    }
    setTimeout(() => {
      setSubscription(false);
    }, time_to_expire);
  }, [userData]);

  const handleFontUpload = () => {
    if (!subscription) {
      setErrorAlert('Please get premium subscription to add fonts');
      return;
    }
    fontInputRef!.current!.click();
  };

  const handleSocketDemoSend = () => {
    socketRef!.current!.send(
      JSON.stringify({
        type: 'demoScreen',
        scale: scale,
        panOffset: panOffset,
        userid: userData.id,
      })
    );
  };

  useEffect(() => {
    if (socketRef!.current!.readyState === 1) {
      if (demoMode) {
        socketRef!.current!.send(
          JSON.stringify({
            type: 'demo',
            status: true,
            userid: userData.id,
          })
        );
        handleSocketDemoSend();
      }
      if (!demoMode) {
        socketRef!.current!.send(
          JSON.stringify({
            type: 'demo',
            status: false,
            userid: userData.id,
          })
        );
      }
    }
  }, [demoMode, socketRef, panOffset, scale]);

  const staticBasicUrl = `${window.location.origin}/static/`;
  const staticBasicReactionsUrl = `${staticBasicUrl}icons/reactions/`;
  const basicReactions = [
    `${staticBasicReactionsUrl}butterfly.svg`,
    `${staticBasicReactionsUrl}heart-black.svg`,
    `${staticBasicReactionsUrl}smile.svg`,
    `${staticBasicReactionsUrl}clown.svg`,
  ];

  const handleDemoModeChange = () => {
    setDemoMode(!demoMode);
    if (!demoMode) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleTouchMove = (event: any) => {
      if (event.touches && event.touches.length > 1) {
        const touch = event.touches[0];

        setPanOffset((prev) => ({
          x: prev.x + (touch.clientX - startPanMousePosition.x) / 3,
          y: prev.y + (touch.clientY - startPanMousePosition.y) / 3,
        }));
        setScale(1);
        // setErrorAlert(`${panOffset.x} ${panOffset.y}`);
        event.preventDefault();
      }
    };

    const handleTouchStart = (event: any) => {
      if (event.touches && event.touches.length > 1) {
        const touch = event.touches[0];
        setStartPanMousePosition({
          x: touch.clientX,
          y: touch.clientY,
        });
      }
    };

    window.addEventListener('touchmove', handleTouchMove, false);
    window.addEventListener('touchstart', handleTouchStart, false);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove, false);
      window.removeEventListener('touchstart', handleTouchStart, false);
    };
  }, [panOffset, startPanMousePosition, scale]);

  const handleAutoShapeChange = (e: any) => {
    setAutoShapeMode(e.target.checked);
    setCookie('autoShapeMode', e.target.checked, { path: pageURL });
  };

  useLayoutEffect(() => {
    canvasRef!.current!.style.backgroundColor = backGroundColor;
  }, [backGroundColor]);

  const handleBackgroundColorChange = (e: any) => {
    setCookie('backGroundColor', e.target.value, { path: pageURL });
    setBackGroundColor(e.target.value);
  };

  const handleSettingsIconClick = (e: any) => {
    const backgroundDark = document.querySelector(
      '.background-dark'
    ) as HTMLInputElement;
    backgroundDark.classList.add('active');

    const handleClickOutsideSettings = (event: any) => {
      if (
        modalCanvasSettingsRef.current &&
        !modalCanvasSettingsRef.current.contains(event.target) &&
        event.target !== e.target
      ) {
        setModalCanvasSettings(false);
        backgroundDark.classList.remove('active');
        window.removeEventListener('click', handleClickOutsideSettings);
      }
    };

    window.addEventListener('click', handleClickOutsideSettings);
    setModalCanvasSettings(true);
  };

  const [textAreaSize, setTextAreaSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (textAreaRef.current) {
      const textAreaResize = () => {
        if (textAreaRef.current)
          setTextAreaSize({
            width: textAreaRef.current!.clientWidth,
            height: textAreaRef.current!.clientHeight,
          });
      };

      new ResizeObserver(textAreaResize).observe(textAreaRef.current!);
    }
  }, [textAreaRef.current]);

  return (
    <div className='canvas-container'>
      <title>{canvasData?.title} - Canvas</title>
      <meta
        name='viewport'
        content='user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height'
      />

      <div className='circular-cursor'></div>

      <a className='logo-container' href='/dashboard/'>
        <object
          className='logo-wings'
          type='image/svg+xml'
          data='/static/icons/logo_wings.svg'
        />
      </a>

      <div className='sidebar-tools-container' ref={toolsContainerRef}>
        <div
          id='selection'
          className='tool-item'
          onClick={() => handleToolChange('selection')}
        >
          <object
            style={{ pointerEvents: 'none' }}
            type='image/svg+xml'
            data={`/static/icons/cursor.svg`}
            width='24px'
            id='object'
          />
        </div>
        <div
          className='tool-item'
          onClick={() => setIsShapeBox(!isShapeBox)}
          ref={shapeBoxButtonRef}
        >
          <object
            style={{ pointerEvents: 'none' }}
            type='image/svg+xml'
            data={`/static/icons/${shapesToolIcon}`}
            width='24px'
            id='object'
          />
        </div>
        <div
          className='tool-item'
          onClick={() => setIsPencilBox(!isPencilBox)}
          ref={pencilBoxButtonRef}
        >
          <object
            style={{ pointerEvents: 'none', position: 'absolute' }}
            type='image/svg+xml'
            data={`/static/icons/pen.svg`}
            width='24px'
            id='pencil'
          />
        </div>
        <div
          className='tool-item'
          onClick={() => handleToolChange('text')}
          id='text'
        >
          <object
            style={{ pointerEvents: 'none', position: 'absolute' }}
            type='image/svg+xml'
            data={`/static/icons/text.svg`}
            width='24px'
            id='text'
          />
        </div>
        <div
          className='tool-item'
          onClick={() => setIsSpecialTools(!isSpecialTools)}
          id='special'
        >
          <object
            style={{ pointerEvents: 'none', position: 'absolute' }}
            type='image/svg+xml'
            data={`/static/icons/special.svg`}
            width='24px'
            id='text'
          />
        </div>
        {isSpecialTools && (
          <div className='additional-box-container' ref={SpecialToolsRef}>
            <div
              className='tool-item'
              onClick={handleVoiceRecordChange}
              id='voice'
            >
              <input
                type='checkbox'
                id='voice'
                className='input-radio-tool'
                // name='special-tools'
                // checked={voiceRecord}
              />
              <object
                className='tool-icon'
                type='image/svg+xml'
                data={`/static/icons/voice.svg`}
                width='24px'
                id='voice'
              />
            </div>
            <div className='tool-item' onClick={handleDemoModeChange} id='demo'>
              <input
                type='checkbox'
                id='demoMode'
                className='input-radio-tool'
                // name='special-tools'
                checked={demoMode}
              />
              <object
                className='tool-icon'
                type='image/svg+xml'
                data={`/static/icons/demo.svg`}
                width='24px'
                id='demoMode'
              />
            </div>
            <div
              className='tool-item'
              onClick={handleAutoShapeChange}
              id='shapeRecognition'
            >
              <input
                type='checkbox'
                id='shapeRecognition'
                className='input-radio-tool'
                // name='special-tools'
                checked={autoShapeMode}
              />
              <object
                className='tool-icon'
                type='image/svg+xml'
                data={`/static/icons/shapes.svg`}
                width='24px'
                id='shapeRecognition'
              />
            </div>
          </div>
        )}
        {isShapeBox && (
          <div className='additional-box-container' ref={shapesBoxRef}>
            <div
              className='tool-item'
              onClick={() => handleToolChange('ellipse')}
              id='ellipse'
            >
              <object
                style={{ pointerEvents: 'none', position: 'absolute' }}
                type='image/svg+xml'
                data={`/static/icons/circle.svg`}
                width='20px'
                id='rectangle'
              />
            </div>
            <div
              className='tool-item'
              onClick={() => handleToolChange('triangle')}
              id='triangle'
            >
              <object
                style={{ pointerEvents: 'none', position: 'absolute' }}
                type='image/svg+xml'
                data={`/static/icons/triangle.svg`}
                width='20px'
                id='rectangle'
              />
            </div>
            <div
              className='tool-item'
              onClick={() => handleToolChange('line')}
              id='line'
            >
              <object
                style={{ pointerEvents: 'none', position: 'absolute' }}
                type='image/svg+xml'
                data={`/static/icons/line.svg`}
                width='24px'
                id='rectangle'
              />
            </div>
            <div
              className='tool-item'
              onClick={() => handleToolChange('rectangle')}
              id='rectangle'
            >
              <object
                style={{ pointerEvents: 'none', position: 'absolute' }}
                type='image/svg+xml'
                data={`/static/icons/square.svg`}
                width='20px'
                id='rectangle'
              />
            </div>
            <div
              className='tool-item'
              onClick={() => handleToolChange('star')}
              id='star'
            >
              <object
                style={{ pointerEvents: 'none', position: 'absolute' }}
                type='image/svg+xml'
                data={`/static/icons/star.svg`}
                width='24px'
                id='rectangle'
              />
            </div>
          </div>
        )}

        {isPencilBox && (
          <div className='additional-box-container' ref={pencilBoxRef}>
            <div
              className='tool-item'
              onClick={() => handleToolChange('eraser')}
              id='eraser'
            >
              <input
                type='radio'
                id='eraser'
                className='input-radio-tool'
                name='tool'
                checked={tool === 'eraser'}
              />
              <object
                className='tool-icon'
                type='image/svg+xml'
                data={`/static/icons/eraser.svg`}
                width='24px'
                id='rectangle'
              />
            </div>
            <div
              className='tool-item'
              onClick={() => handleToolChange('pencil')}
              id='pencil'
            >
              <input
                type='radio'
                id='pencil'
                className='input-radio-tool'
                name='tool'
                checked={tool === 'pencil'}
              />
              <object
                className='tool-icon'
                type='image/svg+xml'
                data={`/static/icons/pen.svg`}
                width='24px'
                id='pencil'
              />
            </div>
            <div className='tool-item'>
              <div className='color-picker-stroke'>
                <input
                  className='stroke-color'
                  type='color'
                  value={strokeColor}
                  onChange={onStrokeColorUpdate}
                />
              </div>
            </div>
            <div
              className='tool-item'
              onMouseOver={() => setIsSliderStrokeShow(true)}
              onMouseLeave={() => setIsSliderStrokeShow(false)}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  backgroundColor: '#000',
                }}
              />
              {isSliderStrokeShow && (
                <div className='slider'>
                  <input
                    onChange={handleStrokeSizeChange}
                    type='range'
                    id='stroke-width'
                    min='3'
                    max='25'
                    step='0.5'
                    value={strokeSize}
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {/* <div className='tool-item'>
          <input
            type='radio'
            id='eraser'
            checked={tool === 'eraser'}
            onChange={() => handleToolChange('eraser')}
          />
        </div> */}
      </div>

      <input
        className='file-input-font'
        ref={fontInputRef}
        type='file'
        accept='.woff, .woff2, .ttf, .otf'
        id='fontFamily'
        onChange={uploadFontFamily}
      />
      <div className='zoom-container'>
        <div>
          <button onClick={onZoomMinus}>-</button>
          <span
            onClick={() => {
              onZoom(1 - scale);
              setZoomIndex(10);
              setCookie('zoomIndex', 10, { path: pageURL });
            }}
          >
            {new Intl.NumberFormat('en-GB', { style: 'percent' }).format(scale)}{' '}
          </span>
          <button onClick={onZoomPlus}>+</button>
        </div>
        <button className='undo-redo-button' onClick={undo}>
          Undo
        </button>
        <button className='undo-redo-button' onClick={redo}>
          Redo
        </button>
        <button
          onClick={() => {
            setPanOffset({ x: 0, y: 0 });
            setCookie('panOffset', { x: 0, y: 0 }, { path: pageURL });
          }}
        >
          Reset
        </button>
      </div>
      {action === 'writing' ? (
        <div ref={textAreaAdditionalContainerRef}>
          <textarea
            ref={textAreaRef}
            spellCheck='false'
            style={{
              position: 'fixed',
              top:
                (selectedElement.y1 - 2) * scale +
                panOffset.y * scale -
                scaleOffset.y,
              left:
                selectedElement.x1 * scale +
                panOffset.x * scale -
                scaleOffset.x,
              font: `${fontSize * scale}px ${fontFamily}`,
              color: fontColor,
              margin: 0,
              padding: 0,
              border: '3px solid lightblue',
              outline: 0,
              resize: 'both',
              width: 100,
              maxWidth: 500,
              height: 'auto',
              wordBreak: 'break-word',
              overflow: 'auto',
              // whiteSpace: 'pre',
              background: 'transparent',
              zIndex: 2,
            }}
          />
          <div
            className='text-editor-container'
            style={{
              top:
                (selectedElement.y1 - 2) * scale +
                panOffset.y * scale -
                scaleOffset.y +
                (textAreaSize.height || 0) +
                20,
              left:
                selectedElement.x1 * scale +
                panOffset.x * scale -
                scaleOffset.x -
                150 +
                (textAreaSize.width || 0) / 2,
            }}
          >
            <div className='text-editor-wrapper'>
              <div className='text-editor'>
                <div className='list-choice'>
                  <div className='list-choice-title'>{fontFamily}</div>
                  <div className='list-choice-objects'>
                    {fonts.map((font: any, index: any) => (
                      <label
                        style={{ fontFamily: font.family }}
                        onClick={() => {
                          setFontFamily(font.family);
                          setCookie('fontFamily', font.family, {
                            path: pageURL,
                          });
                        }}
                      >
                        <input type='radio' name='font' key={index} />
                        <span>{font.family}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className='upload-font-button' onClick={handleFontUpload}>
                  Upload Font
                </div>
                <div className='list-choice-font-size'>
                  <div className='list-choice-font-size-title'>{fontSize}</div>
                  <div className='list-choice-font-size-objects'>
                    {fontSizes.map((size: any, index: any) => (
                      <label
                        onClick={() => {
                          setFontSize(size);
                          setCookie('fontSize', size, {
                            path: pageURL,
                          });
                        }}
                      >
                        <input type='radio' name='font' key={index} />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className='color-picker'>
                  <input
                    type='color'
                    className='font-color'
                    value={fontColor}
                    onChange={handleFontColorChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <canvas
        ref={canvasRef}
        id='canvas'
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{ position: 'absolute', zIndex: 1 }}
      />
      <canvas
        ref={canvasMiniRef}
        width={64}
        height={64}
        style={{
          display: 'none',
          position: 'absolute',
          zIndex: 100,
          backgroundColor: '#fff',
          top: '40vh',
        }}
      />
      {/* <div ref={colorsRef} className='color-picker'>
        <input
          id='stroke-color'
          // value={strokeColor}
          onBlur={onStrokeColorUpdate}
          type='color'
        />
        <input
          id='font-color'
          // value={fontColor}
          onBlur={handleFontColorChange}
          type='color'
        />
        <div>
          <input
            type='color'
            // value={cookies.backGroundColor}
            onBlur={handleBackgroundColorChange}
          />
        </div>
      </div> */}
      {/* <div className='slider'>
        <input
          onBlur={handleStrokeSizeChange}
          type='range'
          id='stroke-width'
          min='3'
          max='25'
          step='0.5'
          // value={strokeSize}
        />
      </div>
      <div className='slider'>
        <input
          onBlur={handleFontSizeChange}
          type='range'
          id='font-size'
          min='24'
          max='100'
          step='2'
          // value={fontSize}
        />
      </div> */}

      {onlineMembers.map((member: any) => (
        <div
          id={`cursor-${member.id}`}
          className='cursor_container'
          style={{
            zIndex: 100,
            position: 'absolute',
            width: 30,
            height: 30,
            display: 'none',
          }}
        >
          <img className='cursor_avatar' src={member.avatar} />
          <object
            style={{
              width: 25,
              height: 25,
              position: 'absolute',
              zIndex: 1,
            }}
            data='/static/icons/cursor.svg'
            type='image/svg+xml'
            className='cursor'
          ></object>
        </div>
      ))}

      <div className='reaction-choose-container'>
        {basicReactions.map((reaction: any) => (
          <div className='reaction-item' key={reaction} onClick={sendReaction}>
            <object
              style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
              type='image/svg+xml'
              data={reaction}
              className='reaction-choose'
            />
          </div>
        ))}
      </div>
      <div
        className='reactions-jump-container'
        onClick={(e) => e.stopPropagation()}
      >
        {reactions.map((reaction: any, index: any) => (
          <div
            key={index}
            className={
              reaction.src === `${staticBasicReactionsUrl}clown.svg`
                ? 'clown'
                : 'reaction-animation'
            }
          >
            <object
              id={`${staticBasicReactionsUrl}clown.svg`}
              style={{
                pointerEvents: 'none',
              }}
              type='image/svg+xml'
              data={reaction.src}
              className='reaction'
            />
          </div>
        ))}
      </div>

      <div
        className='loading_container'
        ref={loadingRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: `${innnerSize.height}px`,
          width: `${innnerSize.width}px`,
          backgroundColor: 'white',
          position: 'absolute',
          zIndex: 1000,
          top: 0,
        }}
      >
        <object
          className='loading_logo'
          data='/static/icons/logo_wings.svg'
          type='image/svg+xml'
        ></object>
      </div>
      {isModalWindowRequest && (
        <div className='modal-window-request'>
          <div
            onClick={handleAccessRequest}
            className='modal-window-request-button'
          >
            Request access
          </div>
        </div>
      )}
      {isNotFound && <div className='modal-window-not-found'>NOT FOUND</div>}
      <div className='canvas-header-right-container'>
        <div className='canvas-header-right-notifications'>
          <Notifications userData={userData} />
        </div>
        <div
          className={`online-members-container ${
            onlineMembers.length > 1 ? 'active' : ''
          }`}
        >
          {onlineMembers.map((member: any) =>
            member.avatar ? (
              <img src={member.avatar} className='online-member' />
            ) : (
              <div className='online-member'>
                <div className='loading-avatar-container' />
              </div>
            )
          )}
        </div>

        {/* {canvasData.admins && */}
        {/* userData.id && */}
        {/* // canvasData!.admins!.includes(userData!.id) && ( */}
        <div>
          <div
            onClick={(e) => {
              handleSettingsIconClick(e);
            }}
            className='settings-icon-container'
          >
            <object
              className='settings-icon'
              data='/static/icons/settings.svg'
              type='image/svg+xml'
            ></object>
          </div>
        </div>
        {/* )} */}
      </div>
      {modalCanvasSettings && (
        <div ref={modalCanvasSettingsRef} className='modal-window-settings'>
          {canvasData.permitted_users.map((user: any) => (
            <div className='permitted-user-container'>
              {user.avatar ? (
                <img src={user.avatar} className='user-avatar' />
              ) : (
                <div className='online-member'>
                  <div className='loading-avatar-container' />
                </div>
              )}
              <div>{user.email}</div>
            </div>
          ))}
          <div className='color-picker-modal'>
            <input
              type='color'
              value={backGroundColor}
              onChange={handleBackgroundColorChange}
            />
          </div>
          <select
            className='grid-selection'
            value={gridType}
            onChange={(e) => setGridType(e.target.value)}
          >
            <option value='lined'>Lined</option>
            <option value='dotted'>Dotted</option>
            <option value='none'>None</option>
          </select>
        </div>
      )}
      <div className='alert-error hidden' ref={errorAlertRef}>
        {errorAlert}
      </div>
      <div className='background-dark'></div>
    </div>
  );
};

export default Canvas;
