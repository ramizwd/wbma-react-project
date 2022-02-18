import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useTag, useUser} from '../hooks/ApiHooks';
import {Avatar} from '@ui-kitten/components';
import {uploadsUrl} from '../utils/variables';

const Comment = (comment) => {
  const [owner, setOwner] = useState([]);
  const [avatar, setAvatar] = useState('https://placekitten.com/200/300');
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();

  const getOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await getUserById(comment.comment.user_id, token);

      setOwner(user);
      console.log('owner:', owner);
    } catch (error) {
      console.error('getCommentOwner error', error);
    }
  };

  const getAvatar = async () => {
    if (owner) {
      try {
        console.log('owner', owner);
        const avatars = await getFilesByTag(`avatar_${owner.user_id}`);
        if (avatars.length === 0) {
          return;
        }
        const avatar = avatars.pop();
        setAvatar(uploadsUrl + avatar.filename);
      } catch (error) {
        console.error('getAvatar error', error);
      }
    }
  };

  useEffect(() => {
    getOwner();
  }, []);

  useEffect(() => {
    getAvatar();
  }, [owner]);

  return (
    <View style={{borderWidth: 1}}>
      <View style={{flexDirection: 'row'}}>
        <Text>{owner.username}</Text>
        <Avatar source={{uri: avatar}} size={'medium'} />
      </View>
      <View>
        <Text>{comment.comment.comment}</Text>
      </View>
    </View>
  );
};

export default Comment;
