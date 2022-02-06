import React from 'react';
import {Text, View} from 'react-native';
import {PropTypes} from 'prop-types';

const Messaging = ({navigation}) => {
  return (
    <View>
      <Text>Messages</Text>
    </View>
  );
};

Messaging.propTypes = {
  navigation: PropTypes.object,
};

export default Messaging;
