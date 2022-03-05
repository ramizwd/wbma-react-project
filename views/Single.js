import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Icon, Input, Layout, Button, Spinner} from '@ui-kitten/components';
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

// View for single post
const Single = ({route, navigation}) => {
  const [comments, setComments] = useState([]);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const {file} = route.params;
  const {getCommentsByPost, postComment, commentLoad} = useComment();
  const {setUpdate, update} = useContext(MainContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      comment: '',
    },
  });

  const [panelProps] = useState({
    fullWidth: true,
    openLarge: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
  });

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
    } catch (error) {
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
        style={{height: '75%'}}
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
                value: 100,
                message: "The comment's maximum length is 100 characters.",
              },
              minLength: {
                value: 1,
                message: 'The comment cannot be empty',
              },
            }}
            render={({field: {onChange, value}}) => (
              <Input
                style={styles.input}
                multiline={true}
                accessoryRight={commentLoad ? <Spinner /> : sendIcon}
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
          {comments.map((comment) => (
            <Comment
              key={comment.comment_id}
              comment={comment}
              navigation={navigation}
            />
          ))}
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
  commentBtn: {
    width: '90%',
    marginRight: 'auto',
    marginLeft: 'auto',
  },
});

Single.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object,
};

export default Single;
