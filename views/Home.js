import React from 'react';
import {Button, SafeAreaView, Text, View} from 'react-native';
import {PropTypes} from 'prop-types';
import Card from '../components/Card';

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
      <SafeAreaView>
        <Card />
      </SafeAreaView>
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
