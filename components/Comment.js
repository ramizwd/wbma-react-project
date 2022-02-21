import {View, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PropTypes} from 'prop-types';
import {useUser} from '../hooks/ApiHooks';
import Avatar from './Avatar';
import {Button} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';
import moment from 'moment';

// Component for individual comment. Takes comment prop.
// Renders comments owners username and avatar, comment text and time when comment was added
const Comment = ({comment}) => {
  const [commentOwner, setCommentOwner] = useState([]);
  const {getUserById} = useUser();
  const {user} = useContext(MainContext);

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

  // Delete comment (didn't get to work yet)
  /* const deleteComment = async () => {
    console.log('delete pressed', comment.comment_id);
    try {
      setUpdate(update + 1);
      const token = await AsyncStorage.getItem('token');
      await deleteComment(comment.comment_id, token);
      console.log('comment deleted');
    } catch (error) {
      console.error('deleteComment error', error);
    }
  }; */

  // Fetch comments owner
  useEffect(() => {
    getCommentOwner();
  }, []);

  return (
    <View style={{borderWidth: 1}}>
      <View style={{flexDirection: 'row'}}>
        <Text>{commentOwner.username}</Text>

        <Avatar userAvatar={comment.user_id} />
      </View>
      <View>
        <Text>{comment.comment}</Text>
        <Text style={{textAlign: 'right', marginRight: 5}}>{`Posted: ${moment(
          comment.time_added
        ).fromNow()}`}</Text>

        {comment.user_id === user.user_id && (
          <Button
            onPress={() => {
              /* deleteComment(); */
            }}
          >
            Delete
          </Button>
        )}
      </View>
    </View>
  );
};

Comment.propTypes = {
  comment: PropTypes.object,
};

export default Comment;
