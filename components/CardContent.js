import {View, Image, StyleSheet} from 'react-native';
import React from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Text, Card} from '@ui-kitten/components';
import LikeIcon from '../assets/svg/like.svg';
import DislikeIcon from '../assets/svg/dislike.svg';
import CommentIcon from '../assets/svg/comment.svg';

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
      <View style={styles.feedback}>
        <LikeIcon style={styles.icon} />
        <DislikeIcon style={styles.icon} />
        <CommentIcon style={styles.icon} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  feedback: {
    flexDirection: 'row',
    marginTop: 10,
  },
  icon: {
    height: 25,
    width: 25,
    color: 'black',
  },
});

CardContent.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CardContent;
