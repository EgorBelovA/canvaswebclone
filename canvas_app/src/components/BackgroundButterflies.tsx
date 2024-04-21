import Butterfly from './Butterfly';
const BackgroundButterflies = () => {
  return (
    <div
      style={{
        position: 'absolute',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    >
      {Array.from(Array(20)).map(() => (
        <Butterfly />
      ))}
    </div>
  );
};

export default BackgroundButterflies;
