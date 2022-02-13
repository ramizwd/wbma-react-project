import React, {useContext} from 'react';
import {Text, View, Button} from 'react-native';
import {PropTypes} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const Profile = ({navigation}) => {
  const {setLoggedIn, user} = useContext(MainContext);
  console.log('user:', user);
  return (
    <View>
      <Text>username: {user.username}</Text>
      <Text>full name: {user.full_name}</Text>
      <Text>user email: {user.email}</Text>
      <Text>user id: {user.user_id}</Text>
      <Button
        title="Log out"
        onPress={async () => {
          await AsyncStorage.clear();
          setLoggedIn(false);
        }}
      />
    </View>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};
export default Profile;
