import {baseUrl} from '../utils/variables';

const login = () => {
  const postLogin = async (loginData) => {
    try {
      const res = await fetch(baseUrl + 'login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(loginData),
      });
      const jsonRes = await res.json();

      if (!res.ok) {
        throw new Error(jsonRes.message);
      }
      return jsonRes;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {postLogin};
};

export {login};
