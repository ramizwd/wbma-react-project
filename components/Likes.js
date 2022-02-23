import {Text, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useLikes} from '../hooks/ApiHooks';
import {PropTypes} from 'prop-types';
import {TouchableWithoutFeedback} from '@ui-kitten/components/devsupport';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon} from '@ui-kitten/components';

const Likes = ({file}) => {
  const {user} = useContext(MainContext);
  const {getLikesByFileId, postLike, deleteLike} = useLikes();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [likeColor, setLikeColor] = useState('black');
  const {setLikeUpdate, likeUpdate} = useContext(MainContext);

  // fetch likes by file ID, set the like array to the like hook, check if user liked
  // then set Liked hook to true and so the color
  const fetchLikes = async () => {
    try {
      const likes = await getLikesByFileId(file.file_id);
      setLikes(likes);
      setLiked(false);
      setLikeColor('#000');
      likes.forEach((like) => {
        if (like.user_id === user.user_id) {
          setLiked(true);
          setLikeColor('red');
        }
      });
    } catch (error) {
      console.error('fetching likes error: ', error);
    }
  };

  // create a like, set color of like button to red
  const createLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await postLike(file.file_id, token);
      res && setLiked(true);
      res && setLikeColor('red');
      res && setLikeUpdate(likeUpdate + 1);
    } catch (error) {
      console.error('create like error: ', error);
    }
  };

  // remove the like
  const removeLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await deleteLike(file.file_id, token);
      res && setLiked(false);
      res && setLikeColor('#000');
      res && setLikeUpdate(likeUpdate + 1);
    } catch (error) {
      console.error('removing like error', error);
    }
  };

  // fetch likes on render
  useEffect(() => {
    fetchLikes();
  }, [likeUpdate]);

  return (
    <TouchableWithoutFeedback
      style={styles.iconWithInfo}
      onPress={() => {
        liked ? removeLike() : createLike();
      }}
    >
      <Icon style={styles.icon} name="heart" color={likeColor} />
      <Text>
        {likes.length > 1 ? likes.length + ' likes' : likes.length + ' like'}
      </Text>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
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

Likes.propTypes = {
  file: PropTypes.object,
};
export default Likes;
