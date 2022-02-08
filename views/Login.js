import React from 'react';
import {Button, View} from 'react-native';
import LoginForm from '../components/LoginForm';
import PropTypes from 'prop-types';

const Login = ({navigation}) => {
  return (
    <View>
      <LoginForm />
      <Button title="Sing up" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
