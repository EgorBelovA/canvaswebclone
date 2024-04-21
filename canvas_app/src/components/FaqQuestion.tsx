const FaqQuestion = (props: any) => {
  return (
    <div style={{ width: '100%' }}>
      <h1>{props.question}</h1>
      <h2>{props.answer}</h2>
      <br />
    </div>
  );
};

export default FaqQuestion;
