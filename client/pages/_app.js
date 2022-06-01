import 'bootstrap/dist/css/bootstrap.css';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <div>
      <div className="container">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default AppComponent;
