import React, {useContext, useEffect} from 'react';
import {Keyboard, StyleSheet, TouchableOpacity} from 'react-native';
import LoginForm from '../components/LoginForm';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Button, Layout, Text} from '@ui-kitten/components';

// Login view
const Login = ({navigation}) => {
  const {getUserByToken} = useUser();
  const {setLoggedIn, setUser} = useContext(MainContext);

  // authenticate the user if token is found and login automatically
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

  // launch authUser when the view is rendered
  useEffect(() => {
    authUser();
  }, []);

  // Login layout
  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={{flex: 1}}
      activeOpacity={1}
    >
      <Layout style={styles.container}>
        <Text>Moment</Text>
        <LoginForm />
        <Layout style={styles.singUp}>
          <Text style={styles.singUpText}>{"Don't have an account?"}</Text>
          <Button
            style={styles.singUpBtn}
            onPress={() => navigation.navigate('Register')}
            appearance="ghost"
            status="success"
          >
            {(evaProps) => (
              <Text {...evaProps} style={styles.singUpBtn}>
                Sign Up
              </Text>
            )}
          </Button>
        </Layout>
      </Layout>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singUp: {
    marginTop: 20,
    flexDirection: 'row',
  },
  singUpText: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 13,
  },
  singUpBtn: {
    color: '#26A96C',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
