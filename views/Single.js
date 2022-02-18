import {View, Text, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Button, Card, Input, List} from '@ui-kitten/components';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {useComment, useTag, useUser} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Controller, useForm} from 'react-hook-form';
import Comment from '../components/Comment';

const Single = ({route}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      comment: '',
    },
  });
  const {file} = route.params;
  const videoRef = useRef(null);
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const {getCommentsByPost, postComment} = useComment();

  const [owner, setOwner] = useState({username: 'Fetching the user...'});
  const [avatar, setAvatar] = useState('https://placekitten.com/200/300');
  const [comments, setComments] = useState([]);

  const getOwner = async () => {
    try {
      // console.log('file', file);
      const token = await AsyncStorage.getItem('token');
      const userData = await getUserById(file.user_id, token);
      setOwner(userData);

      // console.log('comments', d);
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

  const getComments = async () => {
    try {
      const comments = await getCommentsByPost(file.file_id);
      setComments(comments);
    } catch (error) {
      console.error('getComments error', error);
    }
  };

  const createComment = async (data, string) => {
    console.log('here', data);
    const formData = new FormData();
    formData.append('comment', data.comment);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await postComment(data, file.file_id, token);
      console.log('postC', response);
      getComments();
    } catch (error) {
      console.error('postComment error', error);
    }
  };

  useEffect(() => {
    getOwner();
    getAvatar();
    getComments();
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
      <View>
        <Text>{`Comments (${comments.length})`}</Text>
        <Controller
          control={control}
          rules={{
            maxLength: 100,
            required: true,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              multiline={true}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="Write a comment"
              errorMessage={errors.description && 'This is required.'}
            />
          )}
          name="comment"
        />
        <Button onPress={handleSubmit(createComment)}>Send</Button>
        <List
          data={comments}
          renderItem={({item}) => (
            <View>
              <Comment comment={item} />
            </View>
          )}
        ></List>
      </View>
    </Card>
  );
};

Single.propTypes = {
  route: PropTypes.object.isRequired,
};

export default Single;
