import {View, Text, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Card} from '@ui-kitten/components';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {useTag, useUser} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';

const Single = ({route}) => {
  const {file} = route.params;
  const videoRef = useRef(null);
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();

  const [owner, setOwner] = useState({username: 'Fetching the user...'});
  const [avatar, setAvatar] = useState('https://placekitten.com/200/300');

  const getOwner = async () => {
    try {
      console.log('file', file);
      const token = await AsyncStorage.getItem('token');
      const userData = await getUserById(file.user_id, token);
      setOwner(userData);
    } catch (error) {
      console.error('getOwner error', error);
    }
  };

  const getAvatar = async () => {
    try {
      const avatars = await getFilesByTag(`avatar_${file.user_id}`);
      if (avatars.length === 0) {
        return;
      }
      const avatar = avatars.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (error) {
      console.error('getAvatar error', error);
    }
  };

  useEffect(() => {
    getOwner();
    getAvatar();
  }, []);

  return (
    <Card>
      <View style={{flexDirection: 'row'}}>
        <Avatar source={{uri: avatar}} size={'large'} />
        <Text>{`By: ${owner.username}`}</Text>
      </View>
      <View>
        <Text>{file.title}</Text>
        <Text>{file.description}</Text>
        {file.media_type === 'image' ? (
          <Image
            source={{uri: uploadsUrl + file.filename}}
            style={{width: '80%', height: 50}}
          />
        ) : (
          <Video
            ref={videoRef}
            style={{width: '80%', height: '50%'}}
            source={{uri: uploadsUrl + file.filename}}
            useNativeControls={true}
            resizeMode="contain"
          ></Video>
        )}
      </View>
    </Card>
  );
};

Single.propTypes = {
  route: PropTypes.object.isRequired,
};

export default Single;
