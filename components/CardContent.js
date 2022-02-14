import {View, Text, Image} from 'react-native';
import React from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';

const CardContent = ({singleMedia}) => {
  return (
    <View>
      <Image
        source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
        style={{width: 50, height: 50}}
      />
      <View>
        <Text>{singleMedia.title}</Text>
        <Text>{singleMedia.description}</Text>
      </View>
    </View>
  );
};

CardContent.propTypes = {
  singleMedia: PropTypes.object.isRequired,
};

export default CardContent;
