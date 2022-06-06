import axios from 'axios';
import { useState } from 'react';

// makes axios call and handles errors, if any
export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  console.log('+++> ur 0')
  const doRequest = async (props = {}) => {
    try {
      console.log('+++> ur 0.1')
      setErrors(null);
      console.log('+++> ur 0.2')
      // axios handles get, post, put, etc
      const response = await axios[method](
        url,
        { ...body, ...props }
      );

      console.log('+++> ur 1')
      if (onSuccess) {
        console.log('+++> ur 2')
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.log('+++> ur error 200')
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
