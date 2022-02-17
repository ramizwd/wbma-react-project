import React, {useContext, useEffect} from 'react';
import {View, Image, StyleSheet, ImageBackground, Alert} from 'react-native';
import {PropTypes} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Card, Text} from '@ui-kitten/components';

const Profile = ({navigation}) => {
  const {setLoggedIn, user, avatar, setAvatar} = useContext(MainContext);
  console.log('user:', user);

  const {getFilesByTag} = useTag();
  console.log('user:', user);

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (error) {
      console.error(error.message);
      Alert.alert('Notice', 'Set profile pic please');
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity> */}
      <ImageBackground
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGUJD0DgCxdTDAbvk6u3gVm25AqOS6Ksnt9Q&usqp=CAU',
        }}
        style={styles.bgImage}
        // resizeMode="contain"
      />
      {/* </TouchableOpacity> */}
      <Image
        source={{uri: avatar}}
        style={styles.pfImage}
        // resizeMode="contain"
      />
      <Text style={styles.uName}>Welcome back {user.username}!</Text>
      <View style={styles.cardInfo}>
        <Card>
          <Text style={styles.userInfo}>Full name: {user.full_name}</Text>

          <Text style={styles.userInfo}>User email: {user.email}</Text>
          <Text style={styles.userInfo}>User id: {user.user_id}</Text>
        </Card>
      </View>

      <Icon
        name="account-edit"
        color="#4F8EF7"
        size={32}
        style={styles.editIcon}
        onPress={() => {
          navigation.navigate('ModifyProfile');
        }}
      />
      <Icon
        name="logout"
        color="#4F8EF7"
        size={30}
        style={styles.logoutIcon}
        onPress={() => {
          Alert.alert('Logout', 'Are you sure you want to logout?', [
            {text: 'Cancel'},
            {
              text: 'OK',
              onPress: async () => {
                await AsyncStorage.clear();
                setLoggedIn(false);
              },
            },
          ]);
        }}
      />
    </View>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 0,
  },
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    top: '-2%',
  },
  pfImage: {
    position: 'absolute',
    width: '25%',
    height: '15%',
    borderRadius: 100,
    top: '15%',
  },
  uName: {
    position: 'absolute',
    top: '5%',
    fontSize: 25,
  },
  editIcon: {
    position: 'absolute',
    top: '24%',
    right: '20%',
  },
  logoutIcon: {
    position: 'absolute',
    top: '24%',
    right: '5%',
  },
  cardInfo: {
    position: 'absolute',
    top: '30%',
  },
  cardPost: {
    position: 'absolute',
    top: '45%',
  },
});
export default Profile;
