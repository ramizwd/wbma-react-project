import {View, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Text, Card} from '@ui-kitten/components';
import LikeIcon from '../assets/svg/like.svg';
import DislikeIcon from '../assets/svg/dislike.svg';
import CommentIcon from '../assets/svg/comment.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';

const CardContent = ({post}) => {
  const {getUserById} = useUser();
  const [postOwner, setPostOwner] = useState({username: 'test'});

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

  useEffect(() => {
    fetchOwner();
  }, []);

  return (
    <Card>
      <Text>{postOwner.username}</Text>

      <Text>{post.title}</Text>
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
  image: {
    height: 250,
    width: undefined,
    marginBottom: 10,
    marginTop: 10,
  },
});

CardContent.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CardContent;
