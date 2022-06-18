import axios from 'axios';

const BuildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    console.log("+++> buildClient for server env");

    return axios.create({
      baseURL: 'http://www.customguitarsandmore.com',
      headers: req.headers
    });
  } else {
    console.log("+++> buildClient for browser env");
    return axios.create({
      baseUrl: '/'
    });
  }
};

export default BuildClient;