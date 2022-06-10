import Link from 'next/link';
// import BuildClient from "../api/build-client";

const LandingPage = ({ currentUser, tickets }) => {
  console.log("+++> LandingPage 0 tickets:", tickets);

  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets 1123pm</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  );
  // return currentUser ? (
  //   <h1>You are signed in</h1>
  // ) : (
  //   <h1>You are NOT signed in</h1>
  // );
};


LandingPage.getInitialProps = async (context, client, currentUser) => {
  console.log("+++> LandingPage.getInitialProps 0 currentUser:", currentUser);
  console.log('+++> env 1: ', process.env.TICKETING_SERVICE)
  console.log('+++> env 2: ', process.env.STRIPE_PUBLISHABLE_KEY);
  const { data } = await client.get('/api/tickets')
  return { tickets: data }
};

export default LandingPage;
