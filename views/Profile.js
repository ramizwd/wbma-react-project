import React, {useContext, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {PropTypes} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTag, useMedia} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Card, Text, List, Layout} from '@ui-kitten/components';
import UserPost from '../components/UserPost';

const Profile = ({navigation, userPost = true}) => {
  const {setLoggedIn, user, avatar, setAvatar} = useContext(MainContext);
  console.log('user:', user);
  const {mediaArray} = useMedia(userPost);

  const {getFilesByTag} = useTag();
  console.log('user:', user);

  const fetchAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      const avatar = avatarArray.pop();
      setAvatar(uploadsUrl + avatar.filename);
    } catch (error) {
      // console.error(error.message);
      setAvatar('http://placekitten.com/640');
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
        source={
          avatar === undefined
            ? require('../assets/defaultAvatar.png')
            : {uri: avatar}
        }
        style={styles.pfImage}
        // resizeMode="contain"
      />
      <Text style={styles.uName}>Welcome back {user.username}!</Text>
      <Layout style={styles.cardInfo}>
        <Card>
          <Text style={styles.userInfo}>Full name: {user.full_name}</Text>

          <Text style={styles.userInfo}>User email: {user.email}</Text>
        </Card>
      </Layout>

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

      <List
        style={styles.postList}
        data={mediaArray}
        keyExtractor={(item) => item.file_id.toString()}
        renderItem={({item}) => (
          <UserPost post={item} navigation={navigation} userPost={userPost} />
        )}
      ></List>
    </View>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
  userPost: PropTypes.bool,
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
    height: undefined,
    aspectRatio: 1,
    borderRadius: 400,
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
    width: '100%',
    top: '31%',
  },
  cardPost: {
    position: 'absolute',
    top: '45%',
  },
  postList: {
    // position: 'absolute',
    top: '42%',
    width: '100%',
  },
});
export default Profile;
