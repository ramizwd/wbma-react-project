import {Alert, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PropTypes} from 'prop-types';
import {useComment, useUser} from '../hooks/ApiHooks';
import Avatar from './Avatar';
import {Button, Icon, Layout, Spinner, Text} from '@ui-kitten/components';
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

  // Fetch comments owner
  useEffect(() => {
    getCommentOwner();
  }, [update]);

  return (
    <Layout style={{padding: 10}}>
      <Layout style={styles.row}>
        <TouchableWithoutFeedback
          style={styles.row}
          onPress={() => navigation.navigate('User profile', {file: comment})}
        >
          <Avatar userAvatar={comment.user_id} avatarSize="small" />
          <Text appearance="hint" style={styles.commentAuthor}>
            @{commentOwner.username}
          </Text>
        </TouchableWithoutFeedback>

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
      </Layout>
      <Layout>
        <Text style={styles.comment}>{comment.comment}</Text>
        <Text
          appearance="hint"
          category="p2"
          style={{textAlign: 'right', marginRight: 5}}
        >
          {moment(comment.time_added).fromNow()}
        </Text>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comment: {
    marginVertical: 10,
    fontFamily: 'IBMPlexMonoReg',
  },
  commentAuthor: {
    marginLeft: 5,
    fontFamily: 'IBMPlexMonoMed',
  },
  deleteButton: {
    height: '100%',
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Comment.propTypes = {
  comment: PropTypes.object,
  navigation: PropTypes.object,
};

export default Comment;
