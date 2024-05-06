const Butterfly = (props: any) => {
  return (
    <object type='image/svg+xml' data={props.fileName} className='circle' />
  );
};

export default Butterfly;
