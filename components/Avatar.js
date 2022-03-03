import React, {useEffect, useState} from 'react';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Avatar as KittenAvatar} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {ImageBackground} from 'react-native';
import {Shadow} from 'react-native-shadow-2';

const Avatar = ({userAvatar, avatarSize = 'large'}) => {
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState();
  const [avatarBgSize, setAvatarBgSize] = useState({width: 51, height: 51});

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(`avatar_${userAvatar}`);
      if (avatarArray.length === 0) return;
      setAvatar(uploadsUrl + avatarArray.pop().filename);
      avatarSize === 'small' && setAvatarBgSize({width: 35, height: 35});
    } catch (error) {
      console.error('avatar fetch error', error);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  return (
    <Shadow distance={8} startColor={'#00000020'} radius={100} offset={[0, 3]}>
      <ImageBackground
        source={require('../assets/pfpBg.png')}
        style={{
          width: avatarBgSize.width,
          height: avatarBgSize.height,
          justifyContent: 'center',
          alignItems: 'center',
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
    </Shadow>
  );
};

Avatar.propTypes = {
  userAvatar: PropTypes.number,
  avatarSize: PropTypes.string,
};

export default Avatar;
