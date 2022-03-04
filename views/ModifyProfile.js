import React, {useContext, useState} from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useForm, Controller} from 'react-hook-form';
import {Button, Input, Avatar, Card, Layout, Text} from '@ui-kitten/components';
import {PropTypes} from 'prop-types';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import * as ImagePicker from 'expo-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// ModifyProfile view that takes navigation props can modify user's profile including username, password, email, full name and avatar.
const ModifyProfile = ({navigation}) => {
  const {user, setUser, avatar, setAvatar} = useContext(MainContext);
  const {checkUsername, putUser} = useUser();
  const [type, setType] = useState('image');
  const {postTag} = useTag();
  const {postMedia} = useMedia();

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: user.username,
      password: '',
      confirm_password: '',
      email: user.email,
      full_name: user.full_name,
    },
    mode: 'onBlur',
  });
  // choosing image form device
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });
    console.log('(EditProfile)pick image result:', result);
    if (!result.cancelled) {
      setAvatar(result.uri);
      setType(result.type);
    }
  };

  // submit form date by using postMedia and postTag from ApiHooks
  const onSubmit = async (data) => {
    const token = await AsyncStorage.getItem('token');
    console.log('on Submit data:', data);

    const formData = new FormData();
    formData.append('title', 'avatar');
    const filename = avatar.split('/').pop();
    let fileExtension = filename.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;

    formData.append('file', {
      uri: avatar,
      name: filename,
      type: type + '/' + fileExtension,
    });

    try {
      const response = await postMedia(formData, token);
      console.log('(EditProfile) avatar upload response:', response);

      const tagResponse = await postTag(
        {
          file_id: response.file_id,
          tag: 'avatar_' + user.user_id,
        },
        token
      );
      console.log('tag response:', tagResponse);
    } catch (error) {
      console.error(error.message);
    }

    try {
      delete data.confirm_password;
      if (data.password === '') {
        delete data.password;
      }
      const userData = await putUser(data, token);
      if (userData) {
        Alert.alert('Success', userData.message);
        delete data.password;
        setUser(data);
        navigation.navigate('Profile');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout style={styles.container}>
      <ImageBackground
        source={require('../assets/drawerBg.png')}
        style={styles.bgImage}
      />
      <Card style={styles.content}>
        <KeyboardAwareScrollView>
          <TouchableOpacity onPress={pickImage}>
            <Avatar source={{uri: avatar}} style={styles.pfImage} />
          </TouchableOpacity>

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
                textStyle={styles.inputText}
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
                  if (available || user.username === value) {
                    return true;
                  } else {
                    return 'Username is already taken.';
                  }
                } catch (error) {
                  throw new Error(error.message);
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={styles.input}
                textStyle={styles.inputText}
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
                textStyle={styles.inputText}
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
                textStyle={styles.inputText}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                secureTextEntry={true}
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
                textStyle={styles.inputText}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                secureTextEntry={true}
                placeholder="Insert password again*"
                label="Confirm Password"
                status={errors.confirm_password ? 'danger' : 'basic'}
                caption={
                  errors.confirm_password && errors.confirm_password.message
                }
              />
            )}
            name="confirm_password"
          />

          <Text> </Text>
          <Button
            style={styles.button}
            title="Submit"
            onPress={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </KeyboardAwareScrollView>
      </Card>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '95%',
    borderRadius: 20,
    marginVertical: 5,
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'JetBrainsMonoReg',
  },
  pfImage: {
    width: '70%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 400,
    left: '15%',
    borderWidth: 2,
    borderColor: '#0496FF',
  },
  bgImage: {
    top: '-25%',
    width: '100%',
    height: 500,
    flex: 1,
  },
  content: {
    borderRadius: 8,
    marginVertical: 10,
  },
  button: {
    borderRadius: 20,
    backgroundColor: '#26A96C',
  },
});

ModifyProfile.propTypes = {
  navigation: PropTypes.object,
};

export default ModifyProfile;
