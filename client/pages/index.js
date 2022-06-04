// import Link from 'next/link';
// import BuildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log("+++> LandingPage 0 currentUser:", currentUser);
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  )
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  console.log("+++> LandingPage.getInitialProps 0 currentUser:", currentUser);
  return {}
};

export default LandingPage;
