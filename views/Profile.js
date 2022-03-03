import React, {useContext, useEffect, useState} from 'react';
import {View, Image, StyleSheet, ImageBackground, Alert} from 'react-native';
import {PropTypes} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLikes, useTag, useRating} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {Card as Cards, Text, Layout, List} from '@ui-kitten/components';
import Card from '../components/Card';
import {Picker} from '@react-native-picker/picker';
import CardContent from '../components/CardContent';

// Profile view that takes navigation props can display user's general information including avatar, user full name ,user's email, and user's post history, besides user can also modify his/her profile from this view
const Profile = ({navigation}) => {
  const {setLoggedIn, user, avatar, setAvatar} = useContext(MainContext);
  const {getFilesByTag} = useTag();
  const [selectedValue, setSelectedValue] = useState('post');
  const [likeList, setLikeList] = useState([]);
  const [savedList, setSavedList] = useState([]);
  const {getPostsByLikes} = useLikes();
  const {getRatedPostByUser} = useRating();
  const {likeUpdate, saveUpdate} = useContext(MainContext);

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
  // fetching user's liked posts list by using getPostsByLikes from ApiHooks
  const fetchLikesAndSaved = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const likes = await getPostsByLikes(token);
      const saved = await getRatedPostByUser(token);
      setLikeList(likes);
      setSavedList(saved);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  useEffect(() => {
    fetchLikesAndSaved();
  }, [likeUpdate, saveUpdate]);

  return (
    <View style={styles.container}>
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
      <Text style={styles.uName}>
        Welcome back {user.full_name ? user.full_name : user.username}!
      </Text>
      <Layout style={styles.cardInfo}>
        <Cards>
          <Text style={styles.userInfo}>Full name: {user.full_name}</Text>

          <Text style={styles.userInfo}>User email: {user.email}</Text>
        </Cards>
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
      <Layout style={styles.picker}>
        <Picker
          selectedValue={selectedValue}
          style={{height: 50, width: 150}}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="Post history" value="post" />
          <Picker.Item label="Like history" value="like" />
          <Picker.Item label="Saved post" value="saved" />
        </Picker>
      </Layout>

      {selectedValue === 'post' && (
        <Layout style={styles.postList}>
          <Card navigation={navigation} userPost={true} />
        </Layout>
      )}
      {selectedValue === 'like' && (
        <Layout style={styles.postList}>
          <List
            data={likeList}
            keyExtractor={(item) => item.file_id.toString()}
            renderItem={({item}) => (
              <CardContent post={item} navigation={navigation} />
            )}
          ></List>
        </Layout>
      )}
      {selectedValue === 'saved' && (
        <Layout style={styles.postList}>
          <List
            data={savedList}
            keyExtractor={(item) => item.file_id.toString()}
            renderItem={({item}) => (
              <CardContent post={item} navigation={navigation} />
            )}
          ></List>
        </Layout>
      )}
    </View>
  );
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
    alignItems: 'center',
    top: '31%',
  },
  picker: {
    position: 'absolute',
    left: '5%',
    top: '42%',
  },
  postList: {
    position: 'absolute',
    top: '49%',
    height: '51%',
    width: '100%',
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
