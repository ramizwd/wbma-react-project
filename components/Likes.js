import {StyleSheet, Pressable} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useLikes} from '../hooks/ApiHooks';
import {PropTypes} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text} from '@ui-kitten/components';
import LottieView from 'lottie-react-native';

// Component for rendering likes
const Likes = ({file}) => {
  const {user} = useContext(MainContext);
  const {getLikesByFileId, postLike, deleteLike} = useLikes();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState([]);
  const {setLikeUpdate, likeUpdate} = useContext(MainContext);
  const animation = useRef(null);
  const isFirstRun = useRef(true);

  // fetch likes by file ID, set the like array to the like hook, check if user liked
  const fetchLikes = async () => {
    try {
      const likes = await getLikesByFileId(file.file_id);
      setLikes(likes);
      setLiked(false);
      likes.forEach((like) => {
        if (like.user_id === user.user_id) {
          setLiked(true);
        }
      });
    } catch (error) {
      console.error('fetching likes error: ', error);
    }
  };

  // create a like and set liked hook to true, also update likes
  const createLike = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await postLike(file.file_id, token);
      if (res) {
        setLiked(true);
        setLikeUpdate(likeUpdate + 1);
      }
    } catch (error) {
      alert('Error liking, please check network connectivity.');
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
      alert('Error removing like, please check network connectivity.');
      console.error('removing like error', error);
    }
  };

  // Check if it's first render then show correct frame (red) for liked, if like button pressed
  // and liked is true then play animation else play the first frame (gray icon)
  useEffect(() => {
    if (isFirstRun.current) {
      liked ? animation.current.play(25, 25) : animation.current.play(0, 0);
      isFirstRun.current = false;
    } else if (liked) {
      animation.current.play(0, 35);
    } else {
      animation.current.play(0, 0);
    }
  }, [liked]);

  // fetch likes on render
  useEffect(() => {
    fetchLikes();
  }, [likeUpdate]);

  return (
    <Pressable
      style={styles.likeContainer}
      onPress={() => {
        liked ? removeLike() : createLike();
      }}
    >
      <LottieView
        ref={animation}
        source={require('../assets/animation/like.json')}
        loop={false}
        autoPlay={false}
        style={styles.likeAnimation}
      />
      <Text style={styles.likeTxt}>
        {likes.length > 1 ? likes.length + ' likes' : likes.length + ' like'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  likeContainer: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    marginRight: 5,
    marginLeft: 8,
  },
  likeAnimation: {
    height: 35,
    width: 35,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  likeTxt: {
    marginLeft: 5,
    fontFamily: 'JetBrainsMonoReg',
    fontSize: 14,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
});

Likes.propTypes = {
  file: PropTypes.object,
};

export default Likes;
