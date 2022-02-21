import React from 'react';
import {Keyboard, StyleSheet, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RegisterForm from '../components/RegisterForm';
import {Button, Layout, Text} from '@ui-kitten/components';
import PropTypes from 'prop-types';

// Register views
const Register = ({navigation}) => {
  return (
    <KeyboardAwareScrollView>
      <TouchableOpacity
        onPress={() => Keyboard.dismiss()}
        style={{flex: 1}}
        activeOpacity={1}
      >
        <Layout style={styles.container}>
          <Text>Moment</Text>
          <RegisterForm />

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
  singIn: {
    marginTop: 20,
    flexDirection: 'row',
  },
  singInText: {
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 13,
  },
  singInBtn: {
    color: '#26A96C',
  },
});

Register.propTypes = {
  navigation: PropTypes.object,
};
export default Register;
