import React, {useContext, useState} from 'react';
import {Alert, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useForm, Controller} from 'react-hook-form';
import {Button, Input, Avatar, Card} from '@ui-kitten/components';
import {PropTypes} from 'prop-types';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import * as ImagePicker from 'expo-image-picker';

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
      confirmPassword: '',
      email: user.email,
      full_name: user.full_name,
    },
    mode: 'onBlur',
  });

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

    console.log('choosing formData:', formData);

    try {
      delete data.confirmPassword;
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
    <ScrollView>
      <Card style={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.pfImageTo}>
          <Avatar source={{uri: avatar}} style={styles.pfImage} />
        </TouchableOpacity>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            minLength: {
              value: 3,
              message: 'Username has to be at least 3 characters.',
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
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="Username"
              errorMessage={errors.username && errors.username.message}
            />
          )}
          name="username"
        />

        <Controller
          control={control}
          rules={{
            minLength: {
              value: 5,
              message: 'Password has to be at least 5 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="Password"
              errorMessage={errors.password && errors.password.message}
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
                return 'Passwords do not match.';
              }
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="Confirm Password"
              errorMessage={
                errors.confirmPassword && errors.confirmPassword.message
              }
            />
          )}
          name="confirmPassword"
        />

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'This is required.'},
            pattern: {
              value: /\S+@\S+\.\S+$/,
              message: 'Has to be valid email.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="Email"
              errorMessage={errors.email && errors.email.message}
            />
          )}
          name="email"
        />

        <Controller
          control={control}
          rules={{
            minLength: {
              value: 3,
              message: 'Full name has to be at least 3 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
              placeholder="Full name"
              errorMessage={errors.full_name && errors.full_name.message}
            />
          )}
          name="full_name"
        />

        <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  pfImageTo: {
    width: 170,
    height: 170,
  },
  pfImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 400,
  },
});

ModifyProfile.propTypes = {
  navigation: PropTypes.object,
};

export default ModifyProfile;
