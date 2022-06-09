import { useEffect, useState } from 'react';
// import StripeCheckout from 'react-stripe-checkout';
// import Router from 'next/router';
// import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  // const { doRequest, errors } = useRequest({
  //   url: '/api/payments',
  //   method: 'post',
  //   body: {
  //     orderId: order.id
  //   },
  //   onSuccess: (payment) => {
  //     console.log("+++> OrderShow doRequest onSuccess payment:", payment);
  //     Router.push('/orders');
  //   }
  // });

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
    return <div>Order expired</div>
  }

  return (
    <div>
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
