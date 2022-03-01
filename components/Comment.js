import {View, Text, Alert, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PropTypes} from 'prop-types';
import {useComment, useUser} from '../hooks/ApiHooks';
import Avatar from './Avatar';
import {Button, Icon, Layout} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';
import moment from 'moment';
import {TouchableWithoutFeedback} from '@ui-kitten/components/devsupport';

// Component for individual comment. Takes comment prop.
// Renders comments owners username and avatar, comment text and time when comment was added
const Comment = ({comment, navigation}) => {
  const [commentOwner, setCommentOwner] = useState([]);
  const {getUserById} = useUser();
  const {deleteComment} = useComment();
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
  const removeComment = () => {
    Alert.alert('Delete', 'This comment will be deleted!', [
      {text: 'Cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const response = await deleteComment(comment.comment_id, token);
            if (response) {
              setUpdate(update + 1);
              Alert.alert('Deleted', 'The comment has been deleted');
            }
          } catch (error) {
            console.error('deleteComment error', error);
          }
        },
      },
    ]);
  };

  const renderDeleteIcon = () => (
    <Icon name="trash" style={{width: 25, height: 25}} />
  );

  // Fetch comments owner
  useEffect(() => {
    getCommentOwner();
  }, [update]);

  return (
    <View style={{borderWidth: 1}}>
      <Layout
        style={{
          flexDirection: 'row',
        }}
      >
        <TouchableWithoutFeedback
          style={{flexDirection: 'row'}}
          onPress={() => navigation.navigate('User profile', {file: comment})}
        >
          <Avatar userAvatar={comment.user_id} />
          <Text style={{marginLeft: 5}}>{commentOwner.username}</Text>
        </TouchableWithoutFeedback>

        {comment.user_id === user.user_id && (
          <Button
            style={{
              height: 30,
              width: 30,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              textAlign: 'right',
            }}
            onPress={() => {
              removeComment();
            }}
            appearance="ghost"
            accessoryRight={renderDeleteIcon}
          ></Button>
        )}
      </Layout>
      <View>
        <Text>{comment.comment}</Text>
        <Text style={{textAlign: 'right', marginRight: 5}}>{`Posted: ${moment(
          comment.time_added
        ).fromNow()}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});

Comment.propTypes = {
  comment: PropTypes.object,
  navigation: PropTypes.object,
};

export default Comment;
