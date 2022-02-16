import React from 'react';
import {StyleSheet} from 'react-native';
import {PropTypes} from 'prop-types';
import {Button} from '@ui-kitten/components';

const PostButton = ({navigation}) => {
  return (
    <Button
      style={styles.buttonStyle}
      onPress={() => {
        navigation.navigate('Upload post');
      }}
    >
      +
    </Button>
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
  navigation: PropTypes.object,
};

export default PostButton;
