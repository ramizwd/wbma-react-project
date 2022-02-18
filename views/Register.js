import React from 'react';
import {Keyboard, StyleSheet, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RegisterForm from '../components/RegisterForm';
import {Button, Layout, Text} from '@ui-kitten/components';
import PropTypes from 'prop-types';

const Register = ({navigation}) => {
  return (
    <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <Layout style={styles.container}>
          <Text>Moment</Text>
          <RegisterForm />

          <Layout style={styles.singUp}>
            <Text style={styles.singUpText}>Already have an account?</Text>
            <Button
              style={styles.singUpBtn}
              onPress={() => navigation.navigate('Login')}
              appearance="ghost"
              status="success"
            >
              {(evaProps) => (
                <Text {...evaProps} style={styles.singUpBtn}>
                  Sign in
                </Text>
              )}
            </Button>
          </Layout>
        </Layout>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
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

Register.propTypes = {
  navigation: PropTypes.object,
};
export default Register;
