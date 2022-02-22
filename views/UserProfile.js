import React, {useContext, useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image, Alert} from 'react-native';
import {PropTypes} from 'prop-types';
import {Button, Input, Card} from '@ui-kitten/components';
import {useTag, useMedia, useUser} from '../hooks/ApiHooks';
import Avatar from '../components/Avatar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = ({navigation, route}) => {
  const {file} = route.params;
  const {getUserById} = useUser();
  const [postOwner, setPostOwner] = useState({username: 'Loading username...'});

  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await getUserById(file.user_id, token);
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
    <Card style={styles.container}>
      <Avatar userAvatar={file.user_id} style={styles.pfImage} />
      <Text>ID: {postOwner.user_id}</Text>
      <Text>Username: {postOwner.username}</Text>
      <Text>Full name:{postOwner.full_name}</Text>
      <Text>Email: {postOwner.email}</Text>
      <Input
        style={styles.input}
        multiline={true}
        autoCapitalize="none"
        placeholder="Message....."
        textStyle={[styles.text]}
      />

      <Button>Send message</Button>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 100,
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
  },
  input: {
    width: '80%',
    borderRadius: 20,
    marginVertical: 10,
  },
  text: {
    minHeight: '20%',
    textAlignVertical: 'top',
  },
});

UserProfile.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default UserProfile;
