import React from 'react';
import {SafeAreaView} from 'react-native';
import Card from '../components/Card';
import PostButton from '../components/PostButton';
import {PropTypes} from 'prop-types';
import {Layout} from '@ui-kitten/components';

const Home = ({navigation}) => {
  return (
    <SafeAreaView>
      <Layout style={{height: '102%', marginTop: -10}}>
        <Card navigation={navigation} />
        <PostButton
          onPress={() => {
            navigation.navigate('Upload post');
          }}
        />
      </Layout>
    </SafeAreaView>
  );
};

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
