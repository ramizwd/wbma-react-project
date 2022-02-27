import {Alert, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useLikes} from '../hooks/ApiHooks';
import {PropTypes} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Icon, Text} from '@ui-kitten/components';

const Likes = ({file}) => {
  const {user} = useContext(MainContext);
  const {getLikesByFileId, postLike, deleteLike} = useLikes();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const [likeColor, setLikeColor] = useState();
  const {setLikeUpdate, likeUpdate} = useContext(MainContext);
  const pulseIconRef = useRef();

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
    } finally {
      pulseIconRef.current.startAnimation();
    }
  };

  // create a like, set color of like button to red
  const createLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await postLike(file.file_id, token);
      if (res) {
        setLiked(true);

        setLikeUpdate(likeUpdate + 1);
      }
    } catch (error) {
      Alert.alert(
        'Likes Error',
        'Error liking, please check network connectivity.',
        {text: 'OK'}
      );
      console.error('create like error: ', error);
    }
  };

  // remove the like
  const removeLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await deleteLike(file.file_id, token);
      if (res) {
        setLiked(false);

        setLikeUpdate(likeUpdate + 1);
      }
    } catch (error) {
      Alert.alert(
        'Likes Error',
        'Error removing like, please check network connectivity.',
        {text: 'OK'}
      );
      console.error('removing like error', error);
    }
  };

  const renderPulseIcon = () => (
    <Icon
      ref={pulseIconRef}
      color={likeColor}
      animation="pulse"
      name="heart"
      style={styles.icon}
    />
  );

  // fetch likes on render
  useEffect(() => {
    fetchLikes();
  }, [likeUpdate]);

  return (
    <Button
      onPress={() => {
        liked ? removeLike() : createLike();
      }}
      appearance="ghost"
      style={styles.button}
      accessoryLeft={renderPulseIcon}
      status="basic"
    >
      {(props) => (
        <Text {...props} style={{marginLeft: 10}}>
          {likes.length > 1 ? likes.length + ' likes' : likes.length + ' like'}
        </Text>
      )}
    </Button>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: 30,
    width: 30,
  },
});

Likes.propTypes = {
  file: PropTypes.object,
};

export default Likes;
