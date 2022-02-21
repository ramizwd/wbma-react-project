import {Image, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Text, Card, Layout, Spinner, Icon} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableWithoutFeedback} from '@ui-kitten/components/devsupport';
import {useComment, useLikes, useMedia, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import Avatar from './Avatar';
import moment from 'moment';

// Media post content component that takes navigation and post props and renders poster's avatar,
// username and the post information
const CardContent = ({navigation, post}) => {
  const [postOwner, setPostOwner] = useState({username: 'Loading username...'});
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const {getUserById} = useUser();
  const {loading} = useMedia();
  const {getCommentsByPost} = useComment();
  const {update} = useContext(MainContext);
  const {getLikesByFileId, postLike, deleteLike} = useLikes();
  const {user} = useContext(MainContext);
  const [likeColor, setLikeColor] = useState('black');

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

  // fetch likes by file ID, set the like array to the like hook, check if user liked
  // then set Liked hook to true and so the color
  const fetchLikes = async () => {
    try {
      const likes = await getLikesByFileId(post.file_id);
      setLikes(likes);
      likes.forEach((like) => {
        like.user_id === user.user_id && setLiked(true);
        setLikeColor('red');
      });
    } catch (error) {
      console.error('fetching likes error: ', error);
    }
  };

  // create a like, set color of like button to red
  const createLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await postLike(post.file_id, token);
      res && setLiked(true);
      res && setLikeColor('red');
    } catch (error) {
      console.error('create like error: ', error);
    }
  };

  // remove the like
  const removeLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await deleteLike(post.file_id, token);
      res && setLiked(false);
      res && setLikeColor('#000');
    } catch (error) {
      console.error('removing like error', error);
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

  // fetch likes on render
  useEffect(() => {
    fetchLikes();
  }, [liked]);

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
        <Avatar userAvatar={post.user_id} />
        <Layout style={styles.headerContent}>
          <Text category="h6">{postOwner.username}</Text>
          <Text category="h6">{post.title}</Text>
        </Layout>
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
      <Text category="p2" style={styles.time}>{`${moment(
        post.time_added
      ).fromNow()}`}</Text>

      <Layout>
        <Text>{post.description}</Text>
      </Layout>
      <Layout style={styles.feedback}>
        <TouchableWithoutFeedback
          style={styles.iconWithInfo}
          onPress={() => {
            liked ? removeLike() : createLike();
          }}
        >
          <Icon style={styles.icon} name="heart" color={likeColor} />
          <Text>
            {likes.length > 1
              ? likes.length + ' likes'
              : likes.length + ' like'}
          </Text>
        </TouchableWithoutFeedback>
        <Layout style={styles.iconWithInfo}>
          <Icon style={styles.icon} color="#000" name="comment" />
          <Text>
            {comments.length > 1
              ? comments.length + ' comments'
              : comments.length + ' comment'}
          </Text>
        </Layout>
      </Layout>
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
  time: {
    textAlign: 'right',
    flexDirection: 'row-reverse',
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
  iconWithInfo: {
    flexDirection: 'row',
    marginRight: 10,
  },
  icon: {
    height: 30,
    width: 30,
  },
});

CardContent.propTypes = {
  post: PropTypes.object.isRequired,
  navigation: PropTypes.object,
};

export default CardContent;
