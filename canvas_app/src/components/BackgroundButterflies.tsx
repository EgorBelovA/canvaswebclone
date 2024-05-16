import Butterfly from './Butterfly';
const BackgroundButterflies = (props: any) => {
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
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          color: '#fff',
        }}
      ></div>
      {Array.from(Array(props.numberOfButterflies)).map(() => (
        <div className={props.styleClassName}>
          <Butterfly fileName={props.fileName} />
        </div>
      ))}
    </div>
  );
};

export default BackgroundButterflies;
