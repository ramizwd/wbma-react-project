import React, {useContext} from 'react';
import {Text, View, TextInput, Button} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {login} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const LoginForm = () => {
  const {setLoggedIn} = useContext(MainContext);
  const {postLogin} = login();

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
      await postLogin(data);
      setLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
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
          <TextInput onBlur={onBlur} onChangeText={onChange} value={value} />
        )}
        name="password"
      />
      {errors.password && <Text>This is required.</Text>}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default LoginForm;
