import {View, Image, StyleSheet, Alert} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Text, Card as Cards, Layout, Button} from '@ui-kitten/components';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComment, useMedia, useUser} from '../hooks/ApiHooks';
import {Spinner} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';
import Avatar from './Avatar';

const UserPost = ({navigation, post}) => {
  const {getUserById} = useUser();
  const {loading, deleteMedia} = useMedia();
  const {getCommentsByPost} = useComment();
  const [postOwner, setPostOwner] = useState({username: 'Loading username...'});
  const [comments, setComments] = useState([]);
  const {update, setUpdate} = useContext(MainContext);

  const doDelete = () => {
    Alert.alert('Delete', 'This file will be deleted!', [
      {text: 'Cancel'},
      {
        text: 'OK',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const response = await deleteMedia(post.file_id, token);
            console.log('delete', response);
            response && setUpdate(update + 1);
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  // fetching post owner data by ID and setting it to the posterOwner state hook
  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await getUserById(post.user_id, token);
      console.log('user', user);
      setPostOwner(user);
    } catch (error) {
      console.error('fetching owner error', error);
    }
  };

  // fetch comments for comment count
  const fetchComments = async () => {
    try {
      const comments = await getCommentsByPost(post.file_id);
      setComments(comments);
    } catch (error) {
      console.error('fetching comments error', error);
    }
  };

  // fetch both owner and avatar on component render
  useEffect(() => {
    fetchOwner();
  }, []);

  // update the comments count when a new comment is posted
  useEffect(() => {
    fetchComments();
  }, [update]);

  return (
    <Cards
      onPress={() => {
        navigation.navigate('Single post', {
          file: post,
          owner: postOwner,
        });
      }}
    >
      <Layout style={styles.postHeader}>
        {/* <Avatar userAvatar={post.user_id} /> */}
        <View style={styles.headerContent}>
          {/* <Text category="h6">{postOwner.username}</Text> */}
          <Text category="h6">{post.title}</Text>
        </View>
        {/* <FontistoIcon
          name="comment"
          style={styles.icon}
          size={20}
          onPress={() => console.log('comments clicked')}
        /> */}
        {/* <Text>
          {comments.length > 1
            ? comments.length + ' comments'
            : comments.length + ' comment'}
        </Text> */}
      </Layout>

      {!loading ? (
        <Image
          source={{uri: uploadsUrl + post.filename}}
          style={styles.image}
        />
      ) : (
        <Layout style={styles.spinner}>
          <Spinner />
        </Layout>
      )}

      <View>
        <Text>{post.description}</Text>
      </View>
      <View style={styles.feedback}>
        {/* <AntDesignIcon
          name="like2"
          style={styles.icon}
          size={25}
          onPress={() => console.log('Like clicked')}
        />
        <AntDesignIcon
          name="dislike2"
          style={styles.icon}
          size={25}
          onPress={() => console.log('Dislike clicked')}
        />

        <FontistoIcon
          name="comment"
          style={styles.icon}
          size={20}
          onPress={() => console.log('comments clicked')}
        />
        <Text>
          {comments.length > 1
            ? comments.length + ' comments'
            : comments.length + ' comment'}
        </Text> */}
        <Layout style={styles.postHeader}>
          <Button
            onPress={() => {
              navigation.navigate('Modify post', {file: post});
            }}
          >
            Modify
          </Button>
          <Button
            onPress={() => {
              doDelete();
            }}
          >
            Delete
          </Button>
        </Layout>
      </View>
    </Cards>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
    marginRight: 5,
  },
  headerContent: {
    paddingLeft: 10,
    flexDirection: 'column',
  },
  image: {
    height: 250,
    width: undefined,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  spinner: {
    marginLeft: 'auto',
    marginRight: 'auto',
    justifyContent: 'center',
    height: 250,
  },

  feedback: {
    flexDirection: 'row',
    marginTop: 20,
  },
  icon: {
    color: 'black',
    marginRight: 5,
  },
});

UserPost.propTypes = {
  post: PropTypes.object.isRequired,
  navigation: PropTypes.object,
};

export default UserPost;
