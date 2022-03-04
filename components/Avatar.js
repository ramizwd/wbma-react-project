import React, {useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar as KittenAvatar} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {Shadow} from 'react-native-shadow-2';

const Avatar = ({userAvatar, avatarSize = 'large'}) => {
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState();

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
  }, []);

  return (
    <Shadow distance={6} startColor={'#00000020'} radius={100} offset={[0, 3]}>
      <KittenAvatar
        style={{borderColor: '#0496FF', borderWidth: 1.5}}
        source={
          avatar === undefined
            ? require('../assets/defaultAvatar.png')
            : {uri: avatar}
        }
        size={avatarSize}
      ></KittenAvatar>
    </Shadow>
  );
};

Avatar.propTypes = {
  userAvatar: PropTypes.number,
  avatarSize: PropTypes.string,
};

export default Avatar;
