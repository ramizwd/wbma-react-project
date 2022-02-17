import React, {useContext, useEffect} from 'react';
import {Button, View} from 'react-native';
import LoginForm from '../components/LoginForm';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Login = ({navigation}) => {
  const {getUserByToken} = useUser();
  const {setLoggedIn, setUser} = useContext(MainContext);

  const authUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }
    try {
      const userData = await getUserByToken(token);
      console.log('user by token', userData);
      setUser(userData);
      setLoggedIn(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    authUser();
  }, []);

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
