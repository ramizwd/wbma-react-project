import {View, Image} from 'react-native';
import React from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Text, Card} from '@ui-kitten/components';

const CardContent = ({post}) => {
  return (
    <Card>
      <Text>{post.title}</Text>

      <Image
        source={{uri: uploadsUrl + post.thumbnails.w640}}
        style={{width: undefined, height: 200}}
      />
      <View>
        <Text>{post.description}</Text>
      </View>
    </Card>
  );
};

CardContent.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CardContent;
