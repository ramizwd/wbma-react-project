import {Text} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';

const PostButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonStyle}>
      <Text>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    borderRadius: 100,
    backgroundColor: '#0496FF',
  },
});

PostButton.propTypes = {
  onPress: PropTypes.func,
};

export default PostButton;
