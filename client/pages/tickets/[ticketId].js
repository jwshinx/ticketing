import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id
    },
    onSuccess: (order) => {
      console.log("+++> ticket show doRequest onSuccess:", order);
      Router.push(
        '/orders/[orderId]',
        `/orders/${order.id}`
      )
    }
  });

  return (
    <div className='mt-3'>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>

      <div className="mx-auto mt-3 mb-3 alert alert-info" role="alert">
        Click below to make a fake purchase using the Stripe API.
      </div>

      {errors}
      <button
        onClick={() => doRequest()}
        className="btn btn-primary"
      >Purchase</button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
