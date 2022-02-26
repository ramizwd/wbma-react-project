import React, {useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar as KittenAvatar} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {ImageBackground} from 'react-native';

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
    <ImageBackground
      source={require('../assets/pfpBg.png')}
      style={{
        width: 51,
        height: 51,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        backgroundColor: '#0000',
        shadowOpacity: 1,
        shadowRadius: 16.0,
        elevation: 6,
        borderRadius: 100,
        shadowOffset: {
          width: 5,
          height: 5,
        },
      }}
    >
      <KittenAvatar
        source={
          avatar === undefined
            ? require('../assets/defaultAvatar.png')
            : {uri: avatar}
        }
        size={avatarSize}
      ></KittenAvatar>
    </ImageBackground>
  );
};

Avatar.propTypes = {
  userAvatar: PropTypes.number,
  avatarSize: PropTypes.string,
};

export default Avatar;
