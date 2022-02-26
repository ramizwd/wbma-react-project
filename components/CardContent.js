import {Image, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Text, Layout, Spinner, Icon, Button} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComment, useMedia, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import Avatar from './Avatar';
import moment from 'moment';
import Likes from './Likes';
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

  const renderCommentIcon = (props) => (
    <Icon style={styles.icon} color="#000" name="comment" />
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        navigation.navigate('Single post', {
          file: post,
          owner: postOwner,
        });
      }}
    >
      <Layout style={{marginBottom: 8}}>
        <Layout style={styles.postHeader}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('User profile', {file: post})}
          >
            {!userPost && <Avatar userAvatar={post.user_id} />}
          </TouchableWithoutFeedback>
          <Layout style={styles.headerContent}>
            {!userPost && (
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate('User profile', {file: post})
                }
              >
                {postOwner.full_name ? (
                  <Text category="p1">
                    {postOwner.full_name}
                    <Text appearance="hint"> @{postOwner.username}</Text>
                  </Text>
                ) : (
                  <Text appearance="hint">@{postOwner.username}</Text>
                )}
              </TouchableWithoutFeedback>
            )}
            <Text category="h6">{post.title}</Text>
          </Layout>
        </Layout>
        <Layout style={styles.postContent}>
          <Image
            source={{uri: uploadsUrl + post.filename}}
            style={styles.image}
          />
          {/* {!loading ? (
        <Image
          source={{uri: uploadsUrl + post.filename}}
          style={styles.image}
        />
      ) : (
        <Layout style={styles.spinner}>
          <Spinner />
        </Layout>
      )} */}
          <Text category="p2" appearance="hint" style={styles.time}>
            {moment(post.time_added).fromNow()}
          </Text>

          <Layout style={styles.desc}>
            <Text numberOfLines={2}>{post.description}</Text>
          </Layout>
        </Layout>
        <Layout style={styles.feedback}>
          <Likes file={post} />
          <Button
            onPress={() => {
              navigation.navigate('Single post', {
                file: post,
                owner: postOwner,
              });
            }}
            appearance="ghost"
            accessoryLeft={renderCommentIcon}
          >
            {(props) => (
              <Text {...props} style={{marginLeft: 10}}>
                {comments.length > 1
                  ? comments.length + ' comments'
                  : comments.length + ' comment'}
              </Text>
            )}
          </Button>
        </Layout>

        {userPost && (
          <Layout style={styles.buttonGroup}>
            <Button
              style={styles.button}
              onPress={() => {
                navigation.navigate('Modify post', {file: post});
              }}
            >
              Modify
            </Button>
            <Button
              style={styles.button}
              onPress={() => {
                doDelete();
              }}
            >
              Delete
            </Button>
          </Layout>
        )}
      </Layout>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
    padding: 10,
  },
  headerContent: {
    paddingLeft: 10,
    flexDirection: 'column',
    maxWidth: 300,
  },
  postContent: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '95%',
  },
  image: {
    height: 250,
    maxWidth: 600,
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 8,
  },
  time: {
    textAlign: 'right',
  },
  desc: {
    padding: 10,
  },
  // spinner: {
  //   marginLeft: 'auto',
  //   marginRight: 'auto',
  //   justifyContent: 'center',
  //   height: 250,
  // },
  feedback: {
    flexDirection: 'row',
    padding: 10,
  },
  icon: {
    height: 30,
    width: 30,
  },
  button: {
    color: 'black',
    marginRight: 10,
  },
  buttonGroup: {
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
