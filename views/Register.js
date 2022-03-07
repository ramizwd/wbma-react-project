import React from 'react';
import {Keyboard, StyleSheet, TouchableOpacity} from 'react-native';
import RegisterForm from '../components/RegisterForm';
import {Button, Layout, Text} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// Register views
const Register = ({navigation}) => {
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
    fontSize: 14,
    fontFamily: 'JetBrainsMonoReg',
  },
  singInBtn: {
    color: '#26A96C',
    fontSize: 14,
    fontFamily: 'JetBrainsMonoReg',
  },
});

Register.propTypes = {
  navigation: PropTypes.object,
};
export default Register;
