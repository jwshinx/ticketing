import axios from 'axios';

const BuildClient = ({ req }) => {
  console.log("+++> client buildClient 6/22 1145am process.env.JOEL_ENVIRONMENT:", process.env.JOEL_ENVIRONMENT);

  let baseUrlValue = 'http://www.customguitarsandmore.com'
  if (process.env.JOEL_ENVIRONMENT === 'development') {
    baseUrlValue = 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'
    console.log(`+++> client buildClient 6/22 1156am baseUrl set to ${baseUrlValue}`);
  }

  if (typeof window === 'undefined') {
    console.log("+++> buildClient for server env 1235pm");

    return axios.create({
      // baseURL: 'http://www.customguitarsandmore.com',
      // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      baseURL: baseUrlValue,
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