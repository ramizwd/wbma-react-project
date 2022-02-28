import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Button,
  Card,
  Input,
  Layout,
  List,
  Popover,
  Text,
} from '@ui-kitten/components';
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableWithoutFeedback} from '@ui-kitten/components/devsupport';

// View for single post
const Single = ({route, navigation}) => {
  const [comments, setComments] = useState([]);
  const {file, owner, tags} = route.params;
  const {getCommentsByPost, postComment} = useComment();
  const {setUpdate, update} = useContext(MainContext);
  const [visible, setVisible] = useState(false);
  const windowHeight = Dimensions.get('window').height;
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

  // Getting comments when new comment is added
  useEffect(() => {
    getComments();
  }, [update]);

  return (
    <KeyboardAwareScrollView style={{padding: 10}}>
      <Layout
        style={{
          maxHeight: windowHeight * 0.8,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('User profile', {file: file})}
          style={{flexDirection: 'row', alignItems: 'center'}}
        >
          <Avatar userAvatar={file.user_id} />
          <Text style={{marginLeft: 10}}>{owner.username}</Text>
        </TouchableWithoutFeedback>
        <Layout style={styles.row}>
          <Text>Tags: </Text>
          <Layout style={styles.row}>
            {tags.map((tag) => (
              <Text
                style={{borderWidth: 1, marginHorizontal: 2, padding: 4}}
                key={tag.tag_id}
              >
                {tag.tag.split(tagDivider)[1]}
              </Text>
            ))}
          </Layout>
        </Layout>
        <Layout>
          <Text category="h6">{file.title}</Text>

          <Text>{file.description}</Text>

          {file.media_type === 'image' ? (
            <Popover
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginBottom: 200,
              }}
              backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
              visible={visible}
              anchor={() => (
                <TouchableWithoutFeedback onPress={() => setVisible(true)}>
                  <Image
                    source={{uri: uploadsUrl + file.filename}}
                    style={{
                      width: undefined,
                      height: 200,
                      borderRadius: 10,
                      marginTop: 10,
                    }}
                  />
                </TouchableWithoutFeedback>
              )}
            >
              <Image
                source={{uri: uploadsUrl + file.filename}}
                style={{
                  width: 400,
                  height: 400,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
              />
            </Popover>
          ) : (
            <Video
              ref={videoRef}
              style={{width: '80%', height: '50%'}}
              source={{uri: uploadsUrl + file.filename}}
              useNativeControls={true}
              resizeMode="contain"
            ></Video>
          )}
        </Layout>
        <Layout style={{alignItems: 'flex-start'}}>
          <Likes file={file} />
        </Layout>
      </Layout>
      <Layout style={{}}>
        <Text>{`Comments (${comments.length})`}</Text>
        <Layout style={styles.row}>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
              required: true,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={{with: '90%'}}
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
          <Button style={{}} onPress={handleSubmit(createComment)}>
            Send
          </Button>
        </Layout>

        <Layout>
          {comments.map((comment) => (
            <Comment key={comment.time_added} comment={comment} />
          ))}
        </Layout>
      </Layout>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

Single.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object,
};

export default Single;
