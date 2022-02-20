import {View, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PropTypes} from 'prop-types';
import {useTag, useUser} from '../hooks/ApiHooks';
// import {Avatar} from '@ui-kitten/components';
import {uploadsUrl} from '../utils/variables';
import Avatar from './Avatar';
import {Button} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';

const Comment = ({comment}) => {
  const [commentOwner, setCommentOwner] = useState([]);
  const [avatar, setAvatar] = useState();
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const {user, update, setUpdate} = useContext(MainContext);

  const getCommentOwner = async () => {
    try {
      console.log('comment obj', comment);
      const token = await AsyncStorage.getItem('token');
      const user = await getUserById(comment.user_id, token);
      setCommentOwner(user);
      // console.log('commentOwner:', commentOwner);
    } catch (error) {
      console.error('getCommentOwner error', error);
    }
  };

  const deleteComment = async () => {
    console.log('delete pressed', comment.comment_id);
    try {
      setUpdate(update + 1);
      const token = await AsyncStorage.getItem('token');
      await deleteComment(comment.comment_id, token);
      console.log('comment deleted');
    } catch (error) {
      console.error('deleteComment error', error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    const hour = d.getHours() + 2;
    const minute = d.getMinutes();

    const formattedDate = `${day}.${month}.${year} ${hour}:${minute}`;

    return formattedDate;
  };

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
        <Text
          style={{textAlign: 'right', marginRight: 5}}
        >{`Posted: ${formatDate(comment.time_added)}`}</Text>

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
