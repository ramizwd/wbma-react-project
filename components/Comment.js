import {Alert, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PropTypes} from 'prop-types';
import {useComment, useUser} from '../hooks/ApiHooks';
import Avatar from './Avatar';
import {
  Button,
  Divider,
  Icon,
  Layout,
  Spinner,
  Text,
} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';
import moment from 'moment';
import {TouchableWithoutFeedback} from '@ui-kitten/components/devsupport';
import {ThemeContext} from '../contexts/ThemeContext';

// Component for individual comment. Takes comment prop.
// Renders comments owners username and avatar, comment text and time when comment was added
const Comment = ({comment, navigation}) => {
  const [commentOwner, setCommentOwner] = useState([]);
  const {getUserById} = useUser();
  const {deleteComment, commentLoad} = useComment();
  const {user} = useContext(MainContext);
  const {setUpdate, update} = useContext(MainContext);

  // Fetch user who posted the comment
  const getCommentOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await getUserById(comment.user_id, token);
      setCommentOwner(user);
    } catch (error) {
      console.error('getCommentOwner error', error);
    }
  };

  // Delete comment
  const removeComment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await deleteComment(comment.comment_id, token);
      if (response) {
        setUpdate(update + 1);
      }
    } catch (error) {
      Alert.alert('Deleted', 'Deleting comment error, please try again later.');
      console.error('deleteComment error', error);
    }
  };

  // loading indicator
  const LoadingIndicator = () => <Spinner size="medium" />;

  const renderDeleteIcon = () => {
    const themeContext = useContext(ThemeContext);
    return (
      <Icon
        name="trash"
        resizeMode="contain"
        style={{height: 30}}
        color={themeContext.theme === 'light' ? 'black' : 'white'}
      />
    );
  };

  // Fetch comments owner and re fetch when update hook changes
  useEffect(() => {
    getCommentOwner();
  }, [update]);

  // return comments and navigate to profile when user is pressed
  return (
    <Layout style={styles.container}>
      <Layout style={styles.content}>
        <Layout style={styles.commentAndAuthor}>
          <TouchableWithoutFeedback
            onPress={() => {
              commentOwner.user_id === user.user_id
                ? navigation.navigate('Profile')
                : navigation.navigate('User profile', {
                    file: comment,
                  });
            }}
          >
            <Layout style={styles.author}>
              <Avatar userAvatar={comment.user_id} avatarSize="small" />
              <Text appearance="hint" style={styles.commentAuthor}>
                @{commentOwner.username}
              </Text>
            </Layout>
          </TouchableWithoutFeedback>
          <Text style={styles.comment}>{comment.comment}</Text>
        </Layout>
      </Layout>
      {comment.user_id === user.user_id && (
        <Button
          style={styles.deleteButton}
          onPress={() => {
            removeComment();
          }}
          appearance="ghost"
          accessoryRight={commentLoad ? LoadingIndicator : renderDeleteIcon}
        ></Button>
      )}
      <Text
        appearance="hint"
        category="p2"
        style={{textAlign: 'right', marginRight: 5}}
      >
        {moment(comment.time_added).fromNow()}
      </Text>
      <Divider />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentAndAuthor: {
    flexDirection: 'column',
  },
  author: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  commentAuthor: {
    marginLeft: 5,
    fontFamily: 'IBMPlexMonoMed',
    alignSelf: 'flex-start',
  },
  comment: {
    fontFamily: 'IBMPlexMonoReg',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Comment.propTypes = {
  comment: PropTypes.object,
  navigation: PropTypes.object,
};

export default Comment;
