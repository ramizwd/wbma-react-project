import React, {useContext, useState} from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useForm, Controller} from 'react-hook-form';
import {Button, Input, Avatar, Card, withStyles} from '@ui-kitten/components';
import {PropTypes} from 'prop-types';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ModifyProfile view that takes navigation props can modify user's profile including username, password, email, full name and avatar.
const ModifyProfile = ({navigation}) => {
  const [type, setType] = useState('image');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const {user, setUser, avatar, setAvatar} = useContext(MainContext);
  const {checkUsername, putUser} = useUser();
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
      Alert.alert('Error', error.message);
      console.error(error);
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
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : ''}
        style={styles.FlexGrowOne}
      >
        <Card style={styles.card}>
          <TouchableOpacity onPress={pickImage} style={styles.pfImageTo}>
            <Avatar source={{uri: avatar}} style={styles.pfImage} />
          </TouchableOpacity>
          <Text>Name</Text>
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
                  if (available || user.username === value) {
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
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="Insert username*"
                status={errors.username ? 'warning' : 'basic'}
                caption={errors.username && errors.username.message}
              />
            )}
            name="username"
          />
          <Text>Password</Text>
          <Controller
            control={control}
            rules={{
              pattern: {
                value: /(?=.*[\p{Lu}])(?=.*[0-9]).{5,}/u,
                message:
                  'Password must match at least the following criteria: 5 characters, uppercase, a number.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                accessoryRight={renderIcon}
                secureTextEntry={secureTextEntry}
                placeholder="Password"
                status={errors.password ? 'warning' : 'basic'}
                caption={errors.password && errors.password.message}
              />
            )}
            name="password"
          />
          <Text>Confirm password</Text>
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
                accessoryRight={renderIcon}
                secureTextEntry={secureTextEntry}
                placeholder="Conform password again"
                status={errors.confirm_password ? 'warning' : 'basic'}
                caption={
                  errors.confirm_password && errors.confirm_password.message
                }
              />
            )}
            name="confirm_password"
          />
          <Text>Email</Text>
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
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                placeholder="Insert email*"
                status={errors.email ? 'warning' : 'basic'}
                caption={errors.email && errors.email.message}
              />
            )}
            name="email"
          />
          <Text>Full name</Text>
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
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="words"
                placeholder="Full name"
                status={errors.full_name ? 'warning' : 'basic'}
                caption={errors.full_name && errors.full_name.message}
              />
            )}
            name="full_name"
          />
          <Text> </Text>

          <Button onPress={handleSubmit(onSubmit)}>Save</Button>
        </Card>
      </KeyboardAvoidingView>
    </View>
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
    width: '80%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 400,
    borderWidth: 2,
    top: '10%',
    left: '28%',
    borderColor: '#F1C40F',
  },
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: '-45%',
  },
  animation: {position: 'absolute', width: '100%', height: '50%', top: '20%'},
  card: {
    position: 'absolute',
    top: '8%',
    backgroundColor: 'rgba(52, 52, 52, 0.1)',
  },
});

ModifyProfile.propTypes = {
  navigation: PropTypes.object,
};

export default ModifyProfile;
