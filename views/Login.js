import React, {useContext, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import LoginForm from '../components/LoginForm';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import {Button, Layout, Text} from '@ui-kitten/components';

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
    <Layout style={styles.container}>
      <Text>Moment</Text>
      <LoginForm />
      <Layout style={styles.singUp}>
        <Text style={styles.singUpText}>Don't have an account?</Text>
        <Button
          style={styles.singUpBtn}
          onPress={() => navigation.navigate('Register')}
          appearance="ghost"
          status="success"
        >
          {(evaProps) => (
            <Text {...evaProps} style={styles.singUpBtn}>
              Sing Up
            </Text>
          )}
        </Button>
      </Layout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
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
