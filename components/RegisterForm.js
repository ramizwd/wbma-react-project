import React, {useState} from 'react';
import {TouchableWithoutFeedback, StyleSheet, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Input, Button, Layout} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../hooks/ApiHooks';

const RegisterForm = () => {
  const {postUser, checkUsername} = useUser();
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirm_password: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });

  // delete confirm_password on user submission and send user post request to the backend
  const onSubmit = async (data) => {
    try {
      delete data.confirm_password;
      const userData = await postUser(data);
      console.log(userData);
    } catch (error) {
      Alert.alert('Error', error.message);
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
          minLength: {
            value: 2,
            message: 'Full name has to be at least 2 characters long.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="words"
            placeholder="Insert full name"
            label="Full name"
            status={errors.full_name ? 'warning' : 'basic'}
            caption={errors.full_name && errors.full_name.message}
          />
        )}
        name="full_name"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Username is required.'},
          minLength: {
            value: 3,
            message: 'Username has to be at least 3 characters long.',
          },
          validate: async (value) => {
            try {
              const available = await checkUsername(value);
              if (available) {
                return true;
              } else {
                return 'Username is taken.';
              }
            } catch (error) {
              throw new Error(error.message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Insert username*"
            label="Username"
            status={errors.username ? 'warning' : 'basic'}
            caption={errors.username && errors.username.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Email is required.'},
          pattern: {
            value: /\S+@\S+\.\S+$/,
            message: 'Email has to be valid.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Insert email*"
            label="Email"
            status={errors.email ? 'warning' : 'basic'}
            caption={errors.email && errors.email.message}
          />
        )}
        name="email"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Password is required.'},
          pattern: {
            value: /(?=.*[\p{Lu}])(?=.*[0-9]).{5,}/u,
            message:
              'Password must match at least the following criteria: 5 characters, uppercase, a number.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            placeholder="Insert password*"
            label="Password"
            status={errors.password ? 'warning' : 'basic'}
            caption={errors.password && errors.password.message}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Please confirm your password'},
          validate: (value) => {
            const {password} = getValues();
            if (value === password) {
              return true;
            } else {
              return 'Please make sure the passwords match.';
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            placeholder="Insert password again*"
            label="Confirm Password"
            status={errors.confirm_password ? 'warning' : 'basic'}
            caption={errors.confirm_password && errors.confirm_password.message}
          />
        )}
        name="confirm_password"
      />

      <Button onPress={handleSubmit(onSubmit)} style={styles.registerBtn}>
        Register
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
  registerBtn: {
    height: 56,
    marginTop: 20,
  },
});

export default RegisterForm;
