import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {appId, baseUrl} from '../utils/variables';

const baseFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      let message = json.error
        ? `${json.message}: ${json.error}`
        : json.message;
      if (json.error) {
        message = json.message + ': ' + json.error;
      } else {
        message = json.message;
      }
      throw new Error(message || response.statusText);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

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

  const getUserByToken = async (token) => {
    try {
      const res = await fetch(baseUrl + 'users/user', {
        headers: {'x-access-token': token},
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

  const checkUsername = async (username) => {
    const result = await baseFetch(baseUrl + 'users/username/' + username);
    return result.available;
  };

  const putUser = async (data, token) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    return await baseFetch(baseUrl + 'users', options);
  };

  const getUserById = async (userId, token) => {
    const options = {
      headers: {'x-access-token': token},
    };
    return await baseFetch(`${baseUrl}users/${userId}`, options);
  };

  return {postUser, getUserByToken, checkUsername, putUser, getUserById};
};

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const {update} = useContext(MainContext);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const json = await useTag().getFilesByTag(appId);
      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(`${baseUrl}media/${item.file_id}`);
          return await response.json();
        })
      );
      setMediaArray(media);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [update]);

  const postMedia = async (formData, token) => {
    setLoading(true);
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    };
    const result = await baseFetch(baseUrl + 'media', options);
    if (result) {
      setLoading(false);
    }
    return result;
  };

  const putMedia = async (data, token, fileId) => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(data),
    };
    return await baseFetch(`${baseUrl}media/${fileId}`, options);
  };

  const deleteMedia = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    return await baseFetch(`${baseUrl}media/${fileId}`, options);
  };

  const searchMedia = async (data, token) => {
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    return await baseFetch(baseUrl + 'media/search', options);
  };

  return {
    mediaArray: mediaArray,
    postMedia,
    putMedia,
    deleteMedia,
    loading,
    searchMedia,
  };
};

const useTag = () => {
  const postTag = async (tagData, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify(tagData),
    };
    return await baseFetch(baseUrl + 'tags/', options);
  };

  const getFilesByTag = async (tag) => {
    return await baseFetch(`${baseUrl}tags/${tag}`);
  };

  return {postTag, getFilesByTag};
};

const useComment = () => {
  const getCommentsByPost = async (fileId) => {
    return await baseFetch(`${baseUrl}comments/file/${fileId}`);
  };
  const postComment = async (formData, fileId, token) => {
    console.log('formdata', formData);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({file_id: fileId, comment: formData.comment}),
    };
    return await baseFetch(`${baseUrl}comments`, options);
  };
  return {getCommentsByPost, postComment};
};

export {useLogin, useUser, useMedia, useTag, useComment};
