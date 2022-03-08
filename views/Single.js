import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {createRef, useContext, useEffect, useState} from 'react';
import {
  Icon,
  Input,
  Layout,
  Button,
  Spinner,
  Text,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {useComment} from '../hooks/ApiHooks';
import {Controller, useForm} from 'react-hook-form';
import Comment from '../components/Comment';
import {MainContext} from '../contexts/MainContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ThemeContext} from '../contexts/ThemeContext';
import {SwipeablePanel} from 'rn-swipeable-panel';
import CardContent from '../components/CardContent';
import LottieView from 'lottie-react-native';

// View for single post
const Single = ({route, navigation}) => {
  const [comments, setComments] = useState([]);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const {file, openComments = false} = route.params;
  const {getCommentsByPost, postComment, commentLoad} = useComment();
  const {setUpdate, update} = useContext(MainContext);
  const animation = createRef();
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
  const [panelProps] = useState({
    fullWidth: true,
    openLarge: true,
    closeOnTouchOutside: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
  });

  // function for opening or closing swipeable panel
  const openPanel = () => {
    setIsPanelActive(true);
  };
  const closePanel = () => {
    setIsPanelActive(false);
  };

  // Get comments for the post
  const getComments = async () => {
    try {
      const comments = await getCommentsByPost(file.file_id);
      setComments(comments.reverse());
    } catch (error) {
      alert('Error getting comment, please check your internet connectivity.');
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
      response && setUpdate(update + 1);
      response && setValue('comment', '');
    } catch (error) {
      alert('Error posting comment, please check your internet connectivity.');
      console.error('postComment error', error);
    }
  };

  const sendIcon = () => {
    const themeContext = useContext(ThemeContext);

    return (
      <TouchableOpacity onPress={handleSubmit(createComment)}>
        <Icon
          name="send-outline"
          pack="ionIcons"
          style={{height: 25}}
          color={themeContext.theme === 'light' ? 'black' : '#8F9BB3'}
        />
      </TouchableOpacity>
    );
  };

  // Getting comments when new comment is added
  useEffect(() => {
    getComments();
  }, [update]);

  useEffect(() => {
    animation.current?.play();
    openComments && openPanel();
  }, []);

  const LoadingIndicator = () => <Spinner size="medium" />;

  return (
    <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
      <Layout style={{height: '100%'}}>
        <CardContent post={file} navigation={navigation} singlePost={true} />
        <Button
          style={styles.commentBtn}
          onPress={() => {
            openPanel();
          }}
        >
          Open Comments
        </Button>
      </Layout>
      <SwipeablePanel
        style={{maxHeight: '80%'}}
        {...panelProps}
        isActive={isPanelActive}
      >
        <Layout style={{alignItems: 'center'}}>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Enter a comment.',
              },
              maxLength: {
                value: 300,
                message: "The comment's maximum length is 300 characters.",
              },
              minLength: {
                value: 1,
                message: 'The comment cannot be empty',
              },
            }}
            render={({field: {onChange, value}}) => (
              <Input
                style={styles.input}
                textStyle={styles.inputText}
                multiline={true}
                accessoryRight={commentLoad ? LoadingIndicator : sendIcon}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="Write a comment"
                status={errors.comment ? 'warning' : 'basic'}
                caption={errors.comment && errors.comment.message}
              />
            )}
            name="comment"
          />
        </Layout>

        <Layout>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Comment
                key={comment.comment_id}
                comment={comment}
                navigation={navigation}
              />
            ))
          ) : (
            <>
              <Layout style={styles.emptyAnimation}>
                <LottieView
                  ref={animation}
                  source={require('../assets/animation/lottie-astronaut.json')}
                  loop={true}
                  autoPlay
                />
                <Text style={styles.animationTxt} appearance="hint">
                  No comments yet...
                </Text>
              </Layout>
            </>
          )}
        </Layout>
      </SwipeablePanel>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  comment: {
    fontFamily: 'JetBrainsMonoReg',
  },
  font: {
    fontFamily: 'JetBrainsMonoReg',
  },
  input: {
    width: '90%',
    borderRadius: 20,
    marginVertical: 5,
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'JetBrainsMonoReg',
  },
  commentBtn: {
    width: '90%',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 5,
  },
  emptyAnimation: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: '100%',
  },
  animationTxt: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    fontFamily: 'JetBrainsMonoReg',
  },
});

Single.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object,
};

export default Single;
