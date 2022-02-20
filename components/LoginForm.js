import React, {useContext, useState} from 'react';
import {TouchableWithoutFeedback, StyleSheet, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useLogin} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Button, Layout} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginForm = () => {
  const {setLoggedIn, setUser} = useContext(MainContext);
  const {postLogin} = useLogin();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    mode: 'onBlur',
  });

  // send user data to postLogin function, save users token in AsyncStorage
  // and setLoggedIn to true on form submission
  const onSubmit = async (data) => {
    try {
      const userData = await postLogin(data);
      await AsyncStorage.setItem('token', userData.token);
      setUser(userData.user);
      setLoggedIn(true);
    } catch (error) {
      Alert.alert('Error', error.message, [{text: 'ok'}]);
      console.log(error);
    }
  };

  // toggle password visibility hook
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  // render the proper password icon
  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
        style={{fontSize: 20}}
      />
    </TouchableWithoutFeedback>
  );

  return (
    <Layout>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Insert username"
            label="Username"
            status={errors.username ? 'warning' : 'basic'}
            caption={errors.username ? 'Please enter you username' : ''}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            placeholder="Insert password"
            label="Password"
            status={errors.password ? 'warning' : 'basic'}
            caption={errors.password ? 'Please enter your password' : ''}
          />
        )}
        name="password"
      />
      <Button onPress={handleSubmit(onSubmit)} style={styles.loginBtn}>
        Login
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '90%',
    borderRadius: 20,
    marginVertical: 10,
  },
  loginBtn: {
    height: 56,
    marginTop: 20,
  },
});

export default LoginForm;
