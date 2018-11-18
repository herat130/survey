import 'es6-promise';
import fetch from 'isomorphic-fetch';

export default function (url, method = 'GET', data) {
  const fetchConfig = {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      // 'Accept': 'application/json',
      // 'Access-Control-Allow-Methods': 'GET,PUT,POST',
    },
    // credentials: 'omit',
    // cache: 'no-cache',
    // mode: 'cors',
  };
  return fetch(url, fetchConfig)
    .then(result => {
      if (result.status === 200) {
        return result.json();
      }
        return new Error('Issue in API call');
      
    })
    .catch(error => console.warn(error.message));
};