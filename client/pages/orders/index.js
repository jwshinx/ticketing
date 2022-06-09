const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map(order => {
        return <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      })}
    </ul>
  );
}

OrderIndex.getInitialProps = async (context, client) => {
  console.log('+++> OrderIndex.getInitialProps 0')
  const { data } = await client.get('/api/orders');
  console.log('+++> OrderIndex.getInitialProps 1 data:', data)
  return { orders: data };
};

export default OrderIndex;
