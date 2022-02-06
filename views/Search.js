import React from 'react';
import {Text, View} from 'react-native';
import {PropTypes} from 'prop-types';

const Search = ({navigation}) => {
  return (
    <View>
      <Text>Search Screen</Text>
    </View>
  );
};

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
