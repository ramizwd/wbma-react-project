import React from 'react';
import {SafeAreaView} from 'react-native';
import Card from '../components/Card';
import PostButton from '../components/PostButton';
import {PropTypes} from 'prop-types';

const Home = ({navigation}) => {
  return (
    <SafeAreaView>
      <Card />
      {/* <Button
        style={{
          margin: 2,
        }}
        appearance="filled"
        onPress={() => {
          navigation.navigate('Upload post');
        }}
      >
        Post
      </Button> */}
      <PostButton
        onPress={() => {
          navigation.navigate('Upload post');
        }}
      />
    </SafeAreaView>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
