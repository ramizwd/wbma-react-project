import React from 'react';
import {Text, View} from 'react-native';
import {PropTypes} from 'prop-types';

const Notifications = ({navigation}) => {
  return (
    <View>
      <Text>Notifications</Text>
    </View>
  );
};

Notifications.propTypes = {
  navigation: PropTypes.object,
};

export default Notifications;
