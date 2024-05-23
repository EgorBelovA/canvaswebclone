import '../scss/partials/_pricing-card.scss';
import axios from 'axios';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: location.origin,
});

const PricingCard = (props: any) => {
  const handlePayment = () => {
    client.get('/api/create-payment/').then((res) => {
      window.location.href = res.data.payment_form_url;
    });
  };

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
        {props.paymentFlag && (
          <div
            onClick={handlePayment}
            style={{
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '30px',
              backgroundColor: '#999',
              borderRadius: '5px',
              color: '#000',
            }}
          >
            Pay
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
