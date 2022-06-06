import axios from 'axios';
import { useState } from 'react';

// makes axios call and handles errors, if any
export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      console.log('+++> ur 0')
      setErrors(null);
      console.log('+++> ur 0.1')
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
