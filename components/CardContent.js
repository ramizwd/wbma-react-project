import {View, Image, StyleSheet, Alert} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Text, Card, Layout, Button} from '@ui-kitten/components';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComment, useMedia, useUser} from '../hooks/ApiHooks';
import {Spinner} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';
import Avatar from './Avatar';
import {TouchableWithoutFeedback} from '@ui-kitten/components/devsupport';

// Media post content component that takes navigation and post props and renders poster's avatar,
// username and the post information
const CardContent = ({navigation, post, userPost}) => {
  const {getUserById} = useUser();
  const {loading, deleteMedia} = useMedia();
  const {getCommentsByPost} = useComment();
  const [postOwner, setPostOwner] = useState({username: 'Loading username...'});
  const [comments, setComments] = useState([]);
  const {update, setUpdate} = useContext(MainContext);

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
  // delete the selected post
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

  // fetch both owner and avatar on component render
  useEffect(() => {
    fetchOwner();
  }, []);

  // update the comments count when a new comment is posted
  useEffect(() => {
    fetchComments();
  }, [update]);

  return (
    <Card
      onPress={() => {
        navigation.navigate('Single post', {
          file: post,
          owner: postOwner,
        });
      }}
    >
      <Layout style={styles.postHeader}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('User profile', {file: post})}
        >
          {!userPost && <Avatar userAvatar={post.user_id} />}
        </TouchableWithoutFeedback>
        <View style={styles.headerContent}>
          {!userPost && (
            <Text
              onPress={() => navigation.navigate('User profile', {file: post})}
            >
              <Text category="h6">{postOwner.username}</Text>
            </Text>
          )}

          <Text category="h6">{post.title}</Text>
        </View>
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
        <AntDesignIcon
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
        </Text>
      </View>
      {userPost && (
        <Layout style={styles.button}>
          <Button
            style={styles.icon}
            onPress={() => {
              navigation.navigate('Modify post', {file: post});
            }}
          >
            Modify
          </Button>
          <Button
            style={styles.icon}
            onPress={() => {
              doDelete();
            }}
          >
            Delete
          </Button>
        </Layout>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
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
    marginRight: 10,
  },
  button: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

CardContent.propTypes = {
  post: PropTypes.object.isRequired,
  navigation: PropTypes.object,
  userPost: PropTypes.bool,
};

export default CardContent;
