import React from 'react';
import {useMedia} from '../hooks/ApiHooks';
import CardContent from './CardContent';
import {List} from '@ui-kitten/components';
import PropTypes from 'prop-types';

const Card = ({navigation}) => {
  const {mediaArray} = useMedia();

  return (
    <List
      data={mediaArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => (
        <CardContent post={item} navigation={navigation} />
      )}
    ></List>
  );
};

Card.propTypes = {
  navigation: PropTypes.object,
};

export default Card;
