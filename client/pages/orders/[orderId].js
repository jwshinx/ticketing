import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => {
      console.log("+++> OrderShow doRequest onSuccess payment:", payment);
      Router.push('/orders');
    }
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    // fires off once when navigate away or component disappears
    // because of "[]"
    return () => {
      clearInterval(timerId);
    };
  }, []); // may need to be [order]

  if (timeLeft < 0) {
    return (
      <div className='mt-3'>
        <h1>Order expired</h1>
        <div>Ticket {order.ticket.title} {order.ticket.id} has expired. Please try again.</div>
      </div>
    )
  }

  return (
    <div className='mt-3'>
      <h3>Order to purchase</h3>
      <p>
        Time remaining: {timeLeft} seconds
      </p>
      <p>Email: {currentUser.email}</p>
      <p>
        Order Id: {order.id}
      </p>
      <p>Ticket Id: {order.ticket.id}</p>
      <p>Ticket Title: {order.ticket.title}</p>
      <p>Ticket Price: ${order.ticket.price}</p>

      <div className="mx-auto mt-3 mb-3 alert alert-info" role="alert">
        Click "Pay With Card" and enter fake information: credit card number "4242 4242 4242 4242", any future mm/yy date (eg "09/23") and CVC of any three digit number.
      </div>

      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51IfBkWCsDjis5EwHLBwUpjLj8sO4wHomr7E54qkldrapGtryFNbTxOxzNAeuGyBLggBLBvAogCiNRaEW5wgvxD5K005zyoEGwI'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
  // return <div>
  //   <p>
  //     Time remaining: {timeLeft} seconds
  //   </p>
  //   <StripeCheckout 
  //     token={({ id }) => doRequest({ token: id })}
  //     stripeKey={`${process.env.STRIPE_PUBLISHABLE_KEY}`}
  //     amount={order.ticket.price * 100}
  //     email={currentUser.email}
  //   />
  //   {errors}
  // </div>
};

OrderShow.getInitialProps = async(context, client) => {
  console.log("+++> OrderShow.getInitialProps 0")
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  console.log("+++> OrderShow.getInitialProps 1 data:", data)
  return { order: data };
};

export default OrderShow;
