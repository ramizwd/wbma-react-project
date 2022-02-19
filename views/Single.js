import {View, Text, Image} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Avatar, Button, Card, Input, List} from '@ui-kitten/components';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {useComment} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Controller, useForm} from 'react-hook-form';
import Comment from '../components/Comment';
import {MainContext} from '../contexts/MainContext';

const Single = ({route}) => {
  const [comments, setComments] = useState([]);
  const {file, posterAvatar, owner} = route.params;
  const {getCommentsByPost, postComment} = useComment();
  const {setUpdate, update} = useContext(MainContext);
  const videoRef = useRef(null);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      comment: '',
    },
  });

  const getComments = async () => {
    try {
      const comments = await getCommentsByPost(file.file_id);
      setComments(comments);
    } catch (error) {
      console.error('getComments error', error);
    }
  };

  const createComment = async (data) => {
    const formData = new FormData();
    formData.append('comment', data.comment);
    try {
      const token = await AsyncStorage.getItem('token');
      await postComment(data, file.file_id, token);
      setUpdate(update + 1);
      getComments();
    } catch (error) {
      console.error('postComment error', error);
    }
  };

  useEffect(() => {
    getComments();
  }, [update]);

  return (
    <Card>
      <View style={{flexDirection: 'row'}}>
        <Avatar source={{uri: posterAvatar}} size={'large'} />
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
