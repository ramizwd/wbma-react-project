import React, {useCallback, useContext, useState} from 'react';
import {RefreshControl} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import CardContent from './CardContent';
import {List} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import {ThemeContext} from '../contexts/ThemeContext';

// Card component that renders the CardContent component inside a List component with the post data
// fetching from useMedia hook
const Card = ({navigation, userPost = false, othersPost = false}) => {
  const {update, setUpdate} = useContext(MainContext);
  const {mediaArray, loading} = useMedia(userPost, othersPost);
  const [refreshing, setRefreshing] = useState(false);
  const themeContext = useContext(ThemeContext);

  // Re-fetch media and set refresh icon to true
  const onRefresh = useCallback(() => {
    setUpdate(update + 1);
    loading && setRefreshing(true);
  }, []);

  // render a list of posts
  return (
    <List
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={
        themeContext.theme === 'light'
          ? {marginTop: 8, backgroundColor: '#EAEEF4'}
          : {marginTop: 8}
      }
      data={mediaArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => (
        <CardContent
          post={item}
          navigation={navigation}
          userPost={userPost}
          othersPost={othersPost}
        />
      )}
      initialNumToRender={5}
    ></List>
  );
};

Card.propTypes = {
  navigation: PropTypes.object,
  userPost: PropTypes.bool,
  othersPost: PropTypes.bool,
};

export default Card;
