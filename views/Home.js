import React from 'react';
import {SafeAreaView} from 'react-native';
import Card from '../components/Card';
import PostButton from '../components/PostButton';

const Home = () => {
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
      <PostButton />
    </SafeAreaView>
  );
};

export default Home;
