import React, {useContext, useState} from 'react';
import {Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useLogin} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input, Button, Layout} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginForm = () => {
  const {setLoggedIn} = useContext(MainContext);
  const {postLogin} = useLogin();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const userData = await postLogin(data);
      await AsyncStorage.setItem('token', userData.token);
      setLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

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
          />
        )}
        name="username"
      />
      {errors.username && <Text>This is required.</Text>}

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
          />
        )}
        name="password"
      />
      {errors.password && <Text>This is required.</Text>}

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
