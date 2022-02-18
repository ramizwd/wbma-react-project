import {View, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Text, Card, Avatar, Layout} from '@ui-kitten/components';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag, useUser} from '../hooks/ApiHooks';

const CardContent = ({navigation, post}) => {
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
    <Card
      onPress={() => {
        navigation.navigate('Single post', {file: post});
      }}
    >
      <Layout style={styles.postHeader}>
        <Avatar source={{uri: avatar}} size="large" />
        <View style={styles.headerContent}>
          <Text category="h6">{postOwner.username}</Text>
          <Text category="h6">{post.title}</Text>
        </View>
      </Layout>

      <Image source={{uri: uploadsUrl + post.filename}} style={styles.image} />
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
    color: 'black',
    marginRight: 10,
  },
});

CardContent.propTypes = {
  post: PropTypes.object.isRequired,
  navigation: PropTypes.object,
};

export default CardContent;
