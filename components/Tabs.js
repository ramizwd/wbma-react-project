import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Layout, List, TabView, Tab} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';
import Card from './Card';
import CardContent from './CardContent';
import {useLikes, useRating} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PropTypes} from 'prop-types';

const Tabs = ({navigation}) => {
  const [likeList, setLikeList] = useState([]);
  const [savedList, setSavedList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {getPostsByLikes} = useLikes();
  const {getRatedPostByUser} = useRating();
  const {likeUpdate, saveUpdate} = useContext(MainContext);

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
    fetchLikesAndSaved();
  }, [likeUpdate, saveUpdate]);

  return (
    <TabView
      selectedIndex={selectedIndex}
      onSelect={(index) => setSelectedIndex(index)}
    >
      <Tab title="My Posts">
        <Layout style={styles.postList}>
          <Card navigation={navigation} userPost={true} />
        </Layout>
      </Tab>
      <Tab title="Liked">
        <Layout style={styles.postList}>
          <List
            data={likeList}
            keyExtractor={(item) => item.file_id.toString()}
            renderItem={({item}) => (
              <CardContent post={item} navigation={navigation} />
            )}
          ></List>
        </Layout>
      </Tab>
      <Tab title="Saved">
        <Layout style={styles.postList}>
          <List
            data={savedList}
            keyExtractor={(item) => item.file_id.toString()}
            renderItem={({item}) => (
              <CardContent post={item} navigation={navigation} />
            )}
          ></List>
        </Layout>
      </Tab>
    </TabView>
  );
};
const styles = StyleSheet.create({
  postList: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

Tabs.propTypes = {
  navigation: PropTypes.object,
};

export default Tabs;
