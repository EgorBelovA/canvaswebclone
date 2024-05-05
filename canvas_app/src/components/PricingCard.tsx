import '../scss/partials/_pricing-card.scss';
import axios from 'axios';

axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: 'http://127.0.0.1:8001',
});

const PricingCard = (props: any) => {
  const handlePayment = () => {
    // client.post('/payments/', {
    //   amount: {
    //     value: '2.00',
    //     currency: 'RUB',
    //   },
    //   payment_method_data: {
    //     type: 'bank_card',
    //   },
    //   confirmation: {
    //     type: 'redirect',
    //     return_url: 'https://www.example.com/return_url',
    //   },
    //   description: 'Заказ №72',
    // });
    client
      .post('/api/create-payment/', {
        amount: {
          value: '2.00',
          currency: 'RUB',
        },
        confirmation: {
          type: 'redirect',
          return_url: 'https://www.example.com/return_url',
        },
        description: 'Заказ №72',
      })
      .then((res) => {
        //redirect to res.data.confirmation.confirmation_url
        console.log(res);
        window.location.href =
          res.data.payment_form_url.confirmation.confirmation_url;
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
