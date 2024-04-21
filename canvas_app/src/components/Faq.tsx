import FaqQuestion from './FaqQuestion';

const Faq = () => {
  return (
    <div className='pricing-faq-container'>
      <FaqQuestion
        question='What is Canvas?'
        answer='Canvas is a collaborative platform for real-time drawing.'
      />
      <FaqQuestion
        question='How soon will I get my subscription?'
        answer='You will receive your subscription immediately after payment.'
      />
    </div>
  );
};

export default Faq;
