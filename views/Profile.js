import React, {useContext, useEffect} from 'react';
import {Image, StyleSheet, ImageBackground, Alert} from 'react-native';
import {PropTypes} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Text, Layout, Button, Icon} from '@ui-kitten/components';
import {ThemeContext} from '../contexts/ThemeContext';
import Tabs from '../components/Tabs';

// Profile view that takes navigation props can display user's general information including avatar, user full name ,user's email, and user's post history, besides user can also modify his/her profile from this view
const Profile = ({navigation}) => {
  const {setLoggedIn, user, avatar, setAvatar} = useContext(MainContext);
  const {getFilesByTag} = useTag();
  // const [selectedValue, setSelectedValue] = useState('post');
  const themeContext = useContext(ThemeContext);

  // fetching user's avatar by using getFilesByTag from ApiHooks and set the avatar with setAvatar state hook
  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (error) {
      Alert.alert('Notice', 'Set profile pic please');
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  const renderEditIcon = () => (
    <Icon
      color={themeContext.theme === 'light' ? 'black' : 'white'}
      style={styles.editIcon}
      name="pencil"
      pack="evilIcon"
    />
  );
  const renderLogoutIcon = () => (
    <Icon
      name="log-out-outline"
      pack="ionIcons"
      style={styles.logoutIcon}
      color={themeContext.theme === 'light' ? 'black' : 'white'}
    />
  );

  return (
    <Layout style={{height: '100%'}}>
      <Layout style={styles.container}>
        <ImageBackground
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGUJD0DgCxdTDAbvk6u3gVm25AqOS6Ksnt9Q&usqp=CAU',
          }}
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

        <Text style={styles.userName}>
          Welcome back {user.full_name ? user.full_name : user.username}!
        </Text>

        <Layout style={styles.userInfoContainer}>
          <Text style={styles.userInfo}>Full name: {user.full_name}</Text>
          <Text style={styles.userInfo}>Email: {user.email}</Text>
        </Layout>

        <Button
          onPress={() => {
            navigation.navigate('ModifyProfile');
          }}
          style={[styles.iconBtn, {right: '10%'}]}
          accessoryLeft={renderEditIcon}
          appearance="ghost"
        ></Button>
        <Button
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
          style={[styles.iconBtn, {right: '0%'}]}
          accessoryLeft={renderLogoutIcon}
          appearance="ghost"
        ></Button>
      </Layout>

      <Layout style={{flex: 3}}>
        <Tabs navigation={navigation} />
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
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: '70%',
    top: '-2%',
  },
  pfImage: {
    position: 'absolute',
    width: '25%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 400,
    top: '30%',
  },
  userName: {
    position: 'absolute',
    top: '10%',
    fontSize: 25,
    fontFamily: 'JetBrainsMonoReg',
  },
  iconBtn: {
    width: 10,
    height: 50,
    position: 'absolute',
    top: '45%',
  },

  editIcon: {
    height: 35,
    width: 35,
  },
  logoutIcon: {
    height: 25,
    width: 25,
  },
  userInfoContainer: {
    alignItems: 'center',
    top: '30%',
  },
  userInfo: {
    fontFamily: 'JetBrainsMonoReg',
  },
  postList: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  test: {
    position: 'absolute',
    top: '6%',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
