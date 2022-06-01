// import Link from 'next/link';
import BuildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log("+++> LandingPage 0 currentUser:", currentUser);

  return (
    <div>
      <h1>Landing page 4</h1>
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("+++> LandingPage.getInitialProps 0");
  const client = BuildClient(context)
  // axios returns resp with data object
  const { data } = await client.get('/api/users/currentuser')
  console.log("+++> LandingPage.getInitialProps 1 data:", data);
  return data
};

export default LandingPage;
