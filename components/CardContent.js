import {View, Image, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Text, Card, Layout} from '@ui-kitten/components';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComment, useMedia, useUser} from '../hooks/ApiHooks';
import {Spinner} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';
import Avatar from './Avatar';
import moment from 'moment';

// Media post content component that takes navigation and post props and renders poster's avatar,
// username and the post information
const CardContent = ({navigation, post}) => {
  const {getUserById} = useUser();
  const {loading} = useMedia();
  const {getCommentsByPost} = useComment();
  const [postOwner, setPostOwner] = useState({username: 'Loading username...'});
  const [comments, setComments] = useState([]);
  const {update} = useContext(MainContext);

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
        <View style={styles.headerContent}>
          <Text category="h6">{postOwner.username}</Text>
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
      <Text style={styles.time}>{`${moment(post.time_added).fromNow()}`}</Text>

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
          style={[styles.icon, styles.reverseIcon]}
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
  icon: {
    color: 'black',
    marginRight: 10,
  },
  reverseIcon: {
    transform: [{rotateY: '180deg'}],
  },
});

CardContent.propTypes = {
  post: PropTypes.object.isRequired,
  navigation: PropTypes.object,
};

export default CardContent;
