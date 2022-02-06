import React from 'react';
import {Text, View} from 'react-native';
import {PropTypes} from 'prop-types';

const Profile = ({navigation}) => {
  return (
    <View>
      <Text>Profile Screen</Text>
    </View>
  );
};

Profile.propTypes = {
  navigation: PropTypes.object,
};
export default Profile;
