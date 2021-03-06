import React, {useContext, useState} from 'react';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useForm, Controller} from 'react-hook-form';
import {
  Button,
  Input,
  Avatar,
  Layout,
  Text,
  TabView,
  Tab,
} from '@ui-kitten/components';
import {PropTypes} from 'prop-types';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {uploadsUrl} from '../utils/variables';

// ModifyProfile view that takes navigation props can modify user's profile including username, password, email, full name and avatar.
const ModifyProfile = ({navigation}) => {
  const {user, setUser, avatar, setAvatar, update, setUpdate} =
    useContext(MainContext);
  const {checkUsername, putUser} = useUser();
  const [type, setType] = useState('image');
  const {postTag, getFilesByTag} = useTag();
  const {postMedia} = useMedia();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

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

    if (!result.cancelled) {
      const {type} = result;
      const fileInfo = await FileSystem.getInfoAsync(result.uri);

      if (type !== 'image') {
        alert(`Profile image must be an image`);
        return;
      }

      if (!fileInfo?.size) {
        Alert.alert(
          'Failed to Select',
          'file size is unknown, please select another file.'
        );
        return;
      }

      // format size correctly and check the file type then check size accordingly
      const fileSize = fileInfo.size / 1024 / 1024;
      if (fileSize > 5) {
        alert(
          `Profile image size must be smaller than 5MB, please choose another file`
        );
        return;
      }

      setAvatar(result.uri);
      setType(result.type);
    }
  };

  // submit form data by using postMedia and postTag from ApiHooks
  const onSubmit = async (data) => {
    const token = await AsyncStorage.getItem('token');
    if (avatar !== undefined) {
      const formData = new FormData();
      // form data to get file extension to change it from jpg to jpeg
      formData.append('title', 'avatar');
      const filename = avatar.split('/').pop();
      let fileExtension = filename.split('.').pop();
      fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;

      // append fomData with correct avatar data then make
      // a post request using postMedia function
      formData.append('file', {
        uri: avatar,
        name: filename,
        type: type + '/' + fileExtension,
      });

      try {
        const response = await postMedia(formData, token);
        await postTag(
          {
            file_id: response.file_id,
            tag: 'avatar_' + user.user_id,
          },
          token
        );
      } catch (error) {
        console.error(error.message);
      }

      // fetching user's avatar by using getFilesByTag from ApiHooks and set the avatar with setAvatar state hook
      const fetchAvatar = async () => {
        try {
          const avatarArray = await getFilesByTag('avatar_' + user.user_id);
          const avatar = avatarArray.pop();
          setAvatar(uploadsUrl + avatar.filename);
        } catch (error) {
          console.log('error fetching profile', error);
        }
      };
      fetchAvatar();
    }

    // delete confirm password and if password is empty then delete that
    // set user hook with the new data and navigate to profile
    try {
      delete data.confirm_password;
      if (data.password === '') {
        delete data.password;
      }
      const userData = await putUser(data, token);
      if (userData) {
        Alert.alert('Success', userData.message);
        delete data.password;
        setUpdate(update + 1);
        setUser(data);
        navigation.navigate('Profile');
      }
    } catch (error) {
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

  // return inputs layout
  return (
    <Layout style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <ImageBackground
        source={require('../assets/drawerBg.png')}
        style={styles.bgImage}
      />
      <TabView
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
        style={{
          height: '90%',
          width: '85%',
          borderRadius: 5,
        }}
      >
        <Tab title="Edit User">
          <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
            <Layout style={[styles.tabContainer]}>
              <TouchableOpacity onPress={pickImage}>
                <Avatar
                  source={
                    avatar === undefined
                      ? require('../assets/defaultAvatar.png')
                      : {uri: avatar}
                  }
                  style={styles.pfImage}
                />
                <Text style={styles.pfpText} category="p2" appearance="hint">
                  Click on the image to change it
                </Text>
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

              <Button
                style={styles.button}
                title="Submit"
                onPress={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </Layout>
          </KeyboardAwareScrollView>
        </Tab>
        <Tab title="Edit Password">
          <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
            <Layout style={styles.tabContainer}>
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
                    style={styles.input}
                    textStyle={styles.inputText}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    accessoryRight={renderIcon}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
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
                    accessoryRight={renderIcon}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
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

              <Button
                style={styles.button}
                title="Submit"
                onPress={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </Layout>
          </KeyboardAwareScrollView>
        </Tab>
      </TabView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  input: {
    width: '85%',
    borderRadius: 20,
    marginVertical: 5,
  },
  inputText: {
    fontSize: 14,
    fontFamily: 'JetBrainsMonoReg',
  },
  pfImage: {
    width: '50%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: 400,
    borderWidth: 2,
    borderColor: '#0496FF',
  },
  pfpText: {
    marginRight: 'auto',
    marginLeft: 'auto',
    paddingBottom: 10,
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
    width: '85%',
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: '#26A96C',
  },
});

ModifyProfile.propTypes = {
  navigation: PropTypes.object,
};

export default ModifyProfile;
