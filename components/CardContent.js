import {View, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Text, Card, Avatar, Layout} from '@ui-kitten/components';
import LikeIcon from '../assets/svg/like.svg';
import DislikeIcon from '../assets/svg/dislike.svg';
import CommentIcon from '../assets/svg/comment.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag, useUser} from '../hooks/ApiHooks';
// import DefaultAvatar from '../assets/svg/userProfile.svg';

const CardContent = ({post}) => {
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const [postOwner, setPostOwner] = useState({});
  const [avatar, setAvatar] = useState();

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

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(`avatar_${post.user_id}`);
      if (avatarArray.length === 0) return;
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (error) {
      console.error('avatar fetch error', error);
    }
  };

  useEffect(() => {
    fetchOwner();
    fetchAvatar();
  }, []);

  return (
    <Card>
      <Layout style={styles.postHeader}>
        <Avatar source={{uri: avatar}} size="large" />
        <Text>{postOwner.username}</Text>
        <Text>{post.title}</Text>
      </Layout>

      <Image
        source={{uri: uploadsUrl + post.thumbnails.w640}}
        style={styles.image}
      />
      <View>
        <Text>{post.description}</Text>
      </View>
      <View style={styles.feedback}>
        <LikeIcon style={styles.icon} />
        <DislikeIcon style={styles.icon} />
        <CommentIcon style={styles.icon} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  postHeader: {
    flexDirection: 'row',
  },
  image: {
    height: 250,
    width: undefined,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  feedback: {
    flexDirection: 'row',
    marginTop: 20,
  },
  icon: {
    height: 20,
    width: 20,
    color: 'black',
    marginRight: 10,
  },
});

CardContent.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CardContent;
