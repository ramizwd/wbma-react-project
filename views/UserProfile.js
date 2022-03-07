import React, {useEffect, useContext, useState} from 'react';
import {StyleSheet, ImageBackground, Image} from 'react-native';
import {PropTypes} from 'prop-types';
import {Layout, Text} from '@ui-kitten/components';
import {useUser, useTag} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import Tabs from '../components/Tabs';
import {uploadsUrl} from '../utils/variables';

// UserProfile view that takes navigation and route props and renders poster's
// info including ID, username, full name, email and post history.
const UserProfile = ({navigation, route}) => {
  const {file} = route.params;
  const {getUserById} = useUser();
  const {getFilesByTag} = useTag();
  const {update} = useContext(MainContext);
  const [avatar, setAvatar] = useState();
  const {postOwner, setPostOwner, ownerUpdate, setOwnerUpdate} =
    useContext(MainContext);

  // fetching poster's avatar by tag
  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(`avatar_${file.user_id}`);
      if (avatarArray.length === 0) return;
      setAvatar(uploadsUrl + avatarArray.pop().filename);
    } catch (error) {
      console.error('avatar fetch error', error);
    }
  };

  // fetching post owner data by ID
  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await getUserById(file.user_id, token);
      setPostOwner(user);
      setOwnerUpdate(ownerUpdate + 1);
    } catch (error) {
      console.error('fetching owner error', error);
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  useEffect(() => {
    fetchAvatar();
  }, [update]);

  return (
    <Layout style={{height: '100%'}}>
      <Layout style={styles.container}>
        <ImageBackground
          blurRadius={5}
          source={require('../assets/banner2.jpg')}
          style={styles.bgImage}
        />

        <Image
          source={
            avatar === undefined
              ? require('../assets/defaultAvatar.png')
              : {uri: avatar}
          }
          style={styles.pfImage}
        />

        <Text style={styles.userName}>User {postOwner.username}</Text>

        <Layout style={styles.userInfoContainer}>
          <Text style={styles.userInfo}>Full name: {postOwner.full_name}</Text>
          <Text style={styles.userInfo}>Email: {postOwner.email}</Text>
        </Layout>
      </Layout>

      <Layout style={{flex: 3}}>
        <Tabs navigation={navigation} othersPosts={true} userPost={true} />
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pfImage: {
    position: 'absolute',
    width: '25%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 400,
    top: '30%',
  },
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: '70%',
    top: '-3%',
  },
  postList: {
    position: 'absolute',
    top: '50%',
    height: '50%',
    width: '100%',
  },
  userName: {
    color: 'white',
    position: 'absolute',
    top: '10%',
    fontSize: 25,
    fontFamily: 'JetBrainsMonoReg',
  },
  userInfoContainer: {
    alignItems: 'center',
    top: '30%',
  },
  userInfo: {
    fontFamily: 'JetBrainsMonoReg',
  },
});

UserProfile.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default UserProfile;
