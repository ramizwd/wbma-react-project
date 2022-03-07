import React, {useContext, useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar as KittenAvatar} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';

// Avatar component that fetches user's avatar image
const Avatar = ({userAvatar, avatarSize = 'large'}) => {
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState();
  const {update} = useContext(MainContext);
  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(`avatar_${userAvatar}`);
      if (avatarArray.length === 0) return;
      setAvatar(uploadsUrl + avatarArray.pop().filename);
    } catch (error) {
      console.error('avatar fetch error', error);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [update]);

  // render avatar or default image if avatar not found
  return (
    <KittenAvatar
      style={{borderColor: '#0496FF', borderWidth: 1.5}}
      source={
        avatar === undefined
          ? require('../assets/defaultAvatar.png')
          : {uri: avatar}
      }
      size={avatarSize}
    ></KittenAvatar>
  );
};

Avatar.propTypes = {
  userAvatar: PropTypes.number,
  avatarSize: PropTypes.string,
};

export default Avatar;
