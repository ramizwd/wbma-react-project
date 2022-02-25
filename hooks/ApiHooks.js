import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {appId, baseUrl, tagDivider} from '../utils/variables';

// Generic function for fetching and handling error
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

// Custom Login hook for logging in
const useLogin = () => {
  const postLogin = async (loginData) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(loginData),
    };
    return await baseFetch(baseUrl + 'login', options);
  };
  return {postLogin};
};

// Hook for user related data
const useUser = () => {
  const postUser = async (registerData) => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(registerData),
    };
    return await baseFetch(baseUrl + 'users', options);
  };

  // getting user by token
  const getUserByToken = async (token) => {
    const options = {
      headers: {'x-access-token': token},
    };
    return await baseFetch(baseUrl + 'users/user', options);
  };

  // function for checking if username is available
  const checkUsername = async (username) => {
    const result = await baseFetch(baseUrl + 'users/username/' + username);
    return result.available;
  };

  // function for updating user
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

  // getting user by ID
  const getUserById = async (userId, token) => {
    const options = {
      headers: {'x-access-token': token},
    };
    return await baseFetch(`${baseUrl}users/${userId}`, options);
  };

  return {postUser, getUserByToken, checkUsername, putUser, getUserById};
};

// Hook for media related functions
const useMedia = () => {
  const [mediaArray, setMediaArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const {update} = useContext(MainContext);

  // fetching media files and mapping them
  const getMedia = async () => {
    setLoading(true);
    try {
      const json = await useTag().getFilesByTag(appId);
      const media = await Promise.all(
        json.map(async (item) => {
          const response = await fetch(`${baseUrl}media/${item.file_id}`);
          return await response.json();
        })
      );
      // state hook for storing the fetched media
      setMediaArray(media);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // effect hook for refetching the media
  useEffect(() => {
    getMedia();
  }, [update]);

  // posting media
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

  // updating media
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

  // deleting media
  const deleteMedia = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    return await baseFetch(`${baseUrl}media/${fileId}`, options);
  };

  // search for media
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
    mediaArray,
    postMedia,
    putMedia,
    deleteMedia,
    loading,
    searchMedia,
  };
};

// Hook for tags related functions
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

  const getTagsByFileId = async (fileId) => {
    return await baseFetch(`${baseUrl}tags/file/${fileId}`);
  };

  return {postTag, getFilesByTag, getTagsByFileId};
};

// Comments hook
const useComment = () => {
  const getCommentsByPost = async (fileId) => {
    return await baseFetch(`${baseUrl}comments/file/${fileId}`);
  };

  const postComment = async (formData, fileId, token) => {
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

  const deleteComment = async (commentId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    try {
      return await baseFetch(`${baseUrl}comments/${commentId}`, options);
    } catch (error) {
      console.error('deleteComment hook error', error);
    }
  };

  return {getCommentsByPost, postComment, deleteComment};
};

const useLikes = () => {
  const postLike = async (fileId, token) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify({file_id: fileId}),
    };
    return await baseFetch(`${baseUrl}favourites`, options);
  };

  const getLikesByFileId = async (fileId) => {
    return await baseFetch(`${baseUrl}favourites/file/${fileId}`);
  };

  const deleteLike = async (fileId, token) => {
    const options = {
      method: 'DELETE',
      headers: {'x-access-token': token},
    };
    return await baseFetch(`${baseUrl}favourites/file/${fileId}`, options);
  };

  return {postLike, getLikesByFileId, deleteLike};
};

export {useLogin, useUser, useMedia, useTag, useComment, useLikes};
