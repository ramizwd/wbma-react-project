import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';
import PlusIcon from '../assets/svg/plus.svg';

const PostButton = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.buttonStyle}
      activeOpacity={0.9}
    >
      <PlusIcon style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    borderRadius: 100,
    backgroundColor: '#0496FF',
    shadowColor: '#000',
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    shadowOffset: {
      width: 6,
      height: 6,
    },
  },
  icon: {
    height: 25,
    width: 25,
    color: 'black',
  },
});

PostButton.propTypes = {
  onPress: PropTypes.func,
};

export default PostButton;
