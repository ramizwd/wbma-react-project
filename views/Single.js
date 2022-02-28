import {View, Text, Image} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Card, Input, Layout, List} from '@ui-kitten/components';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {useComment, useTag} from '../hooks/ApiHooks';
import {tagDivider, uploadsUrl} from '../utils/variables';
import {Controller, useForm} from 'react-hook-form';
import Comment from '../components/Comment';
import {MainContext} from '../contexts/MainContext';
import Avatar from '../components/Avatar';
import Likes from '../components/Likes';

// View for single post
const Single = ({route}) => {
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const {file, owner} = route.params;
  const {getCommentsByPost, postComment} = useComment();
  const {getTagsByFileId} = useTag();
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

  // Get comments for the post
  const getComments = async () => {
    try {
      console.log('get comments');
      const comments = await getCommentsByPost(file.file_id);
      setComments(comments.reverse());
    } catch (error) {
      console.error('getComments error', error);
    }
  };

  // Add new comment to the post
  const createComment = async (data) => {
    const formData = new FormData();
    formData.append('comment', data.comment);
    try {
      const token = await AsyncStorage.getItem('token');
      await postComment(data, file.file_id, token);
      setUpdate(update + 1);
    } catch (error) {
      console.error('postComment error', error);
    }
  };

  // Get tags for the post
  const getTags = async () => {
    try {
      const tags = await getTagsByFileId(file.file_id);
      setTags(tags);
    } catch (error) {
      console.error('getTags error', error);
    }
  };

  // Getting comments when new comment is added
  useEffect(() => {
    getComments();
  }, [update]);

  useEffect(() => {
    getTags();
  }, []);

  return (
    <Card>
      <View style={{flexDirection: 'row'}}>
        <Avatar userAvatar={file.user_id} />
        <Text>{`By: ${owner.username}`}</Text>
      </View>
      <Layout>
        <Text>Tags:</Text>
        <List
          data={tags}
          renderItem={({item}) => <Text>{item.tag.split(tagDivider)[1]}</Text>}
        />
      </Layout>
      <View>
        <Text>
          {file.title}
          {file.file_id}
        </Text>
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
      <Layout>
        <Likes file={file} />
      </Layout>
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
          style={{maxHeight: '70%'}}
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
