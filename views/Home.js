import React from 'react';
import {Button, Text, View} from 'react-native';
import {PropTypes} from 'prop-types';

const Home = ({navigation}) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Post"
        onPress={() => {
          navigation.navigate('Upload post');
        }}
      />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
