import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Layout, List, TabView, Tab, Spinner} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';
import Card from './Card';
import CardContent from './CardContent';
import {useLikes, useMedia, useRating} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PropTypes} from 'prop-types';

const Tabs = ({navigation, othersPosts}) => {
  const [likeList, setLikeList] = useState([]);
  const [savedList, setSavedList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {getPostsByLikes} = useLikes();
  const {getRatedPostByUser} = useRating();
  const {likeUpdate, saveUpdate, user} = useContext(MainContext);
  const {loading, getMedia, getFilesByUserId} = useMedia();
  const [filesList, setFiles] = useState();

  // fetching user's liked posts list by using getPostsByLikes from ApiHooks
  const fetchLikesAndSaved = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await getMedia();
      const likesResponse = await getPostsByLikes(token);
      const savedResponse = await getRatedPostByUser(token);
      const mediaResponse = await getFilesByUserId(user.user_id);

      const likes = likesResponse.filter((x) => {
        return response.some((y) => {
          return x.file_id == y.file_id;
        });
      });

      const saved = savedResponse.filter((x) => {
        return response.some((y) => {
          return x.file_id == y.file_id;
        });
      });

      const media = mediaResponse.filter((x) => {
        return response.some((y) => {
          return x.file_id == y.file_id;
        });
      });

      setFiles(media);
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
    <Layout>
      {!othersPosts ? (
        <TabView
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <Tab title="My Posts">
            <Layout style={styles.postList}>
              {loading ? (
                <Spinner />
              ) : (
                <List
                  data={filesList}
                  keyExtractor={(item) => item.file_id.toString()}
                  renderItem={({item}) => (
                    <CardContent
                      post={item}
                      userPost={true}
                      othersPost={false}
                      navigation={navigation}
                    />
                  )}
                ></List>
              )}
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
      ) : (
        <TabView
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <Tab title="Posts History">
            <Layout style={styles.postList}>
              {loading ? (
                <Spinner />
              ) : (
                <Card
                  navigation={navigation}
                  userPost={false}
                  othersPost={true}
                />
              )}
            </Layout>
          </Tab>
        </TabView>
      )}
    </Layout>
  );
};
const styles = StyleSheet.create({
  postList: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '95%',
  },
});

Tabs.propTypes = {
  navigation: PropTypes.object,
  othersPosts: PropTypes.bool,
};

export default Tabs;
