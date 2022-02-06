import React from 'react';
import {Text, View} from 'react-native';
import {PropTypes} from 'prop-types';

const Home = ({navigation}) => {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
