import React, {useContext} from 'react';
import {Text, View, Button, Image} from 'react-native';
import {PropTypes} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const Profile = ({navigation}) => {
  const {setLoggedIn, user} = useContext(MainContext);
  console.log('user:', user);
  return (
    <View>
      <Image
        source={{uri: 'http://placekitten.com/640'}}
        style={{width: 100, height: 100, borderRadius: 400 / 2}}
        resizeMode="contain"
      />
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
