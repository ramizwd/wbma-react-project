import {baseUrl} from '../utils/variables';

const useLogin = () => {
  const postLogin = async (loginData) => {
    try {
      const res = await fetch(baseUrl + 'login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(loginData),
      });
      const jsonRes = await res.json();

      if (res.ok) {
        return jsonRes;
      } else {
        throw new Error(`${jsonRes.message}: ${jsonRes.error}`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {postLogin};
};

const useUser = () => {
  const postUser = async (registerData) => {
    try {
      const res = await fetch(baseUrl + 'users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(registerData),
      });
      const jsonRes = await res.json();

      if (res.ok) {
        return jsonRes;
      } else {
        throw new Error(`${jsonRes.message}: ${jsonRes.error}`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  return {postUser};
};

export {useLogin, useUser};
