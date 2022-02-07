import React, {useContext} from 'react';
import {Button, View} from 'react-native';
import LoginForm from '../components/LoginForm';
import {MainContext} from '../contexts/MainContext';

const Login = () => {
  const {setLoggedIn} = useContext(MainContext);

  return (
    <View>
      <LoginForm />
      <Button title="Sing In" onPress={() => setLoggedIn(true)} />
    </View>
  );
};

export default Login;
