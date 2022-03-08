import React, {createRef, useContext, useEffect} from 'react';
import {Keyboard, StyleSheet, TouchableOpacity} from 'react-native';
import RegisterForm from '../components/RegisterForm';
import {Button, Layout, Text} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LottieView from 'lottie-react-native';

// Register views
const Register = ({navigation}) => {
  const animation = createRef();
  useEffect(() => {
    animation.current?.play();
  }, []);
  return (
    <Layout
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <KeyboardAwareScrollView style={{width: '100%'}}>
        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          style={{flex: 1}}
          activeOpacity={1}
        >
          <Layout>
            <Text style={styles.appTitle} category="h3">
              {'<Moment/>'}
            </Text>
            <Layout style={styles.loginAnimation}>
              <LottieView
                ref={animation}
                source={require('../assets/animation/jumping-balls.json')}
                style={styles.animation}
                loop={true}
              />
            </Layout>

            <RegisterForm
              onPress={() => {
                navigation.navigate('Login');
              }}
            />

            <Layout style={styles.singIn}>
              <Text style={styles.singInText}>Already have an account?</Text>
              <Button
                style={styles.singInBtn}
                onPress={() => navigation.navigate('Login')}
                appearance="ghost"
                status="success"
              >
                {(evaProps) => (
                  <Text {...evaProps} style={styles.singInBtn}>
                    Sign In
                  </Text>
                )}
              </Button>
            </Layout>
          </Layout>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  appTitle: {
    marginRight: 'auto',
    marginLeft: 'auto',
    fontFamily: 'JetBrainsMonoReg',
    marginTop: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  singIn: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  singInText: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 13,
  },
  singInBtn: {
    color: '#26A96C',
  },
  loginAnimation: {
    height: 110,
    width: '100%',
  },
});

Register.propTypes = {
  navigation: PropTypes.object,
};
export default Register;
