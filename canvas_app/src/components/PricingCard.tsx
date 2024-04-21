import '../scss/partials/_pricing-card.scss';

const PricingCard = (props: any) => {
  return (
    <div className='pricing-card'>
      <h1 className='title'>{props.title}</h1>
      <h3 className='description'>{props.description}</h3>
      <p>{props.price}</p>
      <div>
        <div>
          {props.list &&
            props.list.map((e: any, index: number) => <li key={index}>{e}</li>)}
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
