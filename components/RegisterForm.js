import React, {useState} from 'react';
import {TouchableWithoutFeedback, StyleSheet, Alert} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {Input, Button, Layout} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useUser} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';

const RegisterForm = ({onPress}) => {
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
      if (userData) {
        Alert.alert('Success', 'Account successfully. Move to login?', [
          {
            text: 'Cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              onPress();
            },
          },
        ]);
      }
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
    <Layout
      style={{justifyContent: 'center', alignItems: 'center', marginTop: 10}}
    >
      <Controller
        control={control}
        rules={{
          minLength: {
            value: 2,
            message: 'Full name has to be at least 2 characters long.',
          },
          maxLength: {
            value: 13,
            message: 'Full name can be maximum of 13 characters long.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            style={styles.input}
            textStyle={styles.inputTxt}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="words"
            placeholder="Insert full name"
            label="Full name"
            status={errors.full_name ? 'danger' : 'basic'}
            caption={errors.full_name && errors.full_name.message}
          />
        )}
        name="full_name"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Username is required.'},
          pattern: {
            value: /^.\S*$/,
            message: 'Please remove any spaces.',
          },
          minLength: {
            value: 3,
            message: 'Username has to be at least 3 characters long.',
          },
          maxLength: {
            value: 13,
            message: 'Username can be maximum of 13 characters long.',
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
            textStyle={styles.inputTxt}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Insert username*"
            label="Username"
            status={errors.username ? 'danger' : 'basic'}
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
            textStyle={styles.inputTxt}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Insert email*"
            label="Email"
            status={errors.email ? 'danger' : 'basic'}
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
            textStyle={styles.inputTxt}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            placeholder="Insert password*"
            label="Password"
            status={errors.password ? 'danger' : 'basic'}
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
            textStyle={styles.inputTxt}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            accessoryRight={renderIcon}
            secureTextEntry={secureTextEntry}
            placeholder="Insert password again*"
            label="Confirm Password"
            status={errors.confirm_password ? 'danger' : 'basic'}
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
  inputTxt: {
    fontSize: 14,
    fontFamily: 'JetBrainsMonoReg',
  },
  registerBtn: {
    width: '90%',
    height: 56,
    marginTop: 20,
  },
});

RegisterForm.propTypes = {
  onPress: PropTypes.func,
};

export default RegisterForm;
