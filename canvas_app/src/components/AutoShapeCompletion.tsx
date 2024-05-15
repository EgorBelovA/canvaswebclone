// import { useState } from 'react';
// import { Stage, Layer, Line } from 'react-konva';

// const AutoShapeCompletion = () => {
//   const [lines, setLines] = useState<{ x: number; y: number }[]>([]);

//   //   const handleMouseDown = (e: any) => {
//   //     const { offsetX, offsetY } = e.evt;
//   //     setLines([...lines, { x: offsetX, y: offsetY }]);
//   //   };

//   return (
//     <Stage width={window.innerWidth} height={window.innerHeight}>
//       <Layer>
//         {lines.map((_, i) => (
//           <Line
//             key={i}
//             points={[...lines.flatMap((p) => [p.x, p.y])]}
//             stroke='black'
//             strokeWidth={2}
//             tension={0.5}
//           />
//         ))}
//       </Layer>
//     </Stage>
//   );
// };

// export default AutoShapeCompletion;
