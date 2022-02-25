import React from 'react';
import {useMedia} from '../hooks/ApiHooks';
import CardContent from './CardContent';
import {List} from '@ui-kitten/components';
import PropTypes from 'prop-types';

// Card component that renders the CardContent component inside a List component with the post data
// fetching from useMedia hook
const Card = ({navigation, userPost = false}) => {
  const {mediaArray} = useMedia(userPost);

  return (
    <List
      data={mediaArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => (
        <CardContent post={item} navigation={navigation} userPost={userPost} />
      )}
    ></List>
  );
};

Card.propTypes = {
  navigation: PropTypes.object,
  userPost: PropTypes.bool,
};

export default Card;
