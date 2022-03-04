import React, {useEffect, useContext} from 'react';
import {StyleSheet, ImageBackground} from 'react-native';
import {PropTypes} from 'prop-types';
import {Card as Cards, Layout, Text} from '@ui-kitten/components';
import {useUser} from '../hooks/ApiHooks';
import Avatar from '../components/Avatar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Card from '../components/Card';
import {MainContext} from '../contexts/MainContext';

// UserProfile view that takes navigation and route props and renders poster's info including ID, username, full name, email and post history.
const UserProfile = ({navigation, route}) => {
  const {file} = route.params;
  const {getUserById} = useUser();
  const {postOwner, setPostOwner, ownerUpdate, setOwnerUpdate} =
    useContext(MainContext);

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

  return (
    <Layout style={styles.container}>
      <ImageBackground
        source={require('../assets/drawerBg.png')}
        style={styles.bgImage}
      />
      <Cards style={styles.card}>
        <Avatar userAvatar={file.user_id} style={styles.pfImage} />
        <Text>ID: {postOwner.user_id}</Text>
        <Text>Username: {postOwner.username}</Text>
        <Text>Full name:{postOwner.full_name}</Text>
        <Text>Email: {postOwner.email}</Text>
      </Cards>
      <Text style={styles.text}>Post history:</Text>
      <Layout style={styles.postList}>
        <Card navigation={navigation} othersPost={true} />
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pfImageTo: {
    width: 170,
    height: 170,
  },
  pfImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 400,
    left: '50%',
    borderWidth: 2,
    borderColor: '#F1C40F',
  },
  text: {
    // minHeight: '20%',
    // textAlignVertical: 'top',
    position: 'absolute',
    top: '45%',
    fontSize: 25,
    left: '5%',
  },
  bgImage: {
    top: '-20%',
    width: '100%',
    height: 500,
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
    borderRadius: 20,
    top: '-70%',
  },
  postList: {
    position: 'absolute',
    top: '50%',
    height: '50%',
    width: '100%',
  },
});

UserProfile.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default UserProfile;
