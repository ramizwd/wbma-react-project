import React from 'react';
import {Text, View} from 'react-native';
import {PropTypes} from 'prop-types';

const Settings = ({navigation}) => {
  return (
    <View>
      <Text>Settings Screen</Text>
    </View>
  );
};

Settings.propTypes = {
  navigation: PropTypes.object,
};

export default Settings;
