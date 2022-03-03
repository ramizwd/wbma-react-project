import {Image, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Button,
  Icon,
  Input,
  Layout,
  Popover,
  Spinner,
  Text,
} from '@ui-kitten/components';
import {Video} from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {useComment} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Controller, useForm} from 'react-hook-form';
import Comment from '../components/Comment';
import {MainContext} from '../contexts/MainContext';
import Avatar from '../components/Avatar';
import Likes from '../components/Likes';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TouchableWithoutFeedback} from '@ui-kitten/components/devsupport';
import Tags from '../components/Tags';
import {ThemeContext} from '../contexts/ThemeContext';

// View for single post
const Single = ({route, navigation}) => {
  const [comments, setComments] = useState([]);
  const {file, owner} = route.params;
  const {getCommentsByPost, postComment, commentLoad} = useComment();
  const {setUpdate, update} = useContext(MainContext);
  const [visible, setVisible] = useState(false);
  const windowHeight = Dimensions.get('window').height;
  const [maxDescHeight, setMaxDescHeigh] = useState(windowHeight * 0.25);
  const [showingMore, setShowingMore] = useState(false);
  const [descriptionButton, letDescriptionButton] = useState(false);
  const [desctBtnText, setDescBtnText] = useState('Show more');

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
      const response = await postComment(data, file.file_id, token);
      if (response) {
        setUpdate(update + 1);
      }
    } catch (error) {
      console.error('postComment error', error);
    }
  };

  const LoadingIndicator = () => <Spinner size="medium" />;

  const sendIcon = () => {
    const themeContext = useContext(ThemeContext);

    return (
      <TouchableOpacity onPress={handleSubmit(createComment)}>
        <Icon
          name="send-outline"
          pack="ionIcons"
          style={{height: 25}}
          color={themeContext.theme === 'light' ? 'black' : 'white'}
        />
      </TouchableOpacity>
    );
  };

  // Getting comments when new comment is added
  useEffect(() => {
    getComments();
  }, [update]);

  return (
    <KeyboardAwareScrollView style={{padding: 10}}>
      <Layout
        style={
          !showingMore && {
            maxHeight: windowHeight * 0.85,
          }
        }
      >
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('User profile', {file: file})}
          style={{flexDirection: 'row', alignItems: 'center'}}
        >
          <Avatar userAvatar={file.user_id} />
          <Text style={{marginLeft: 10}}>{owner.username}</Text>
        </TouchableWithoutFeedback>
        <Layout style={(styles.row, {marginVertical: 5})}>
          <Tags post={file} />
        </Layout>
        <Layout>
          <Text style={{marginVertical: 5}} category="h6">
            {file.title}
          </Text>
          <Layout
            onLayout={(evt) => {
              const {height} = evt.nativeEvent.layout;
              console.log('height', height);
              if (height >= maxDescHeight) {
                console.log('height reached');
                letDescriptionButton(true);
              }
            }}
            maxHeight={maxDescHeight + 5}
          >
            <Layout style={descriptionButton && {maxHeight: '90%'}}>
              <Text>{file.description}</Text>
            </Layout>

            {descriptionButton && (
              <Button
                onPress={() => {
                  if (!showingMore) {
                    setShowingMore(true);
                    setMaxDescHeigh(1000);
                    setDescBtnText('Show less');
                    console.log('showing more', showingMore);
                  } else {
                    setMaxDescHeigh(windowHeight * 0.25);
                    setDescBtnText('Show more');
                    setShowingMore(false);
                  }
                }}
                style={{alignSelf: 'flex-end'}}
                size="tiny"
              >
                {desctBtnText}
              </Button>
            )}
          </Layout>

          {file.media_type === 'image' ? (
            <Popover
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              placement="top"
              backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
              visible={visible}
              onBackdropPress={() => setVisible(false)}
              anchor={() => (
                <TouchableWithoutFeedback
                  style={{height: 250, marginTop: 10}}
                  onPress={() => setVisible(true)}
                >
                  <Image
                    source={{uri: uploadsUrl + file.filename}}
                    style={{
                      width: undefined,
                      height: '95%',
                      borderRadius: 10,
                      resizeMode: 'contain',
                      marginTop: 10,
                    }}
                  />
                </TouchableWithoutFeedback>
              )}
            >
              <Image
                source={{uri: uploadsUrl + file.filename}}
                resizeMode="contain"
                style={{
                  width: 400,
                  height: 400,
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
              required: {
                value: true,
                message: 'Enter a comment.',
              },
              maxLength: {
                value: 100,
                message: "The comment's maximum length is 100 characters.",
              },
              minLength: {
                value: 1,
                message: 'The comment cannot be empty',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={{width: '95%'}}
                onBlur={onBlur}
                multiline={true}
                accessoryRight={commentLoad ? LoadingIndicator : sendIcon}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="Write a comment"
                status={errors.comment ? 'warning' : 'basic'}
                caption={errors.comment && errors.comment.message}
                textStyle={styles.comment}
              />
            )}
            name="comment"
          />
        </Layout>

        <Layout>
          {comments.map((comment) => (
            <Comment
              key={comment.comment_id}
              comment={comment}
              navigation={navigation}
            />
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
  comment: {
    fontFamily: 'JetBrainsMonoReg',
  },
});

Single.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object,
};

export default Single;
