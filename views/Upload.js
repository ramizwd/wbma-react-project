import {
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {Input, Button, Layout, Spinner, Text} from '@ui-kitten/components';
import React, {useCallback, useContext, useState} from 'react';
import {PropTypes} from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {useFocusEffect} from '@react-navigation/native';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {tagDivider} from '../utils/variables';
import SelectTags from '../components/SelectTags';
import Constants from 'expo-constants';

// This view is for uploading a new post
const Upload = ({navigation}) => {
  const [image, setImage] = useState();
  const [fileSelected, setFileSelected] = useState(false);
  const [type, setType] = useState('');
  const {postMedia, loading} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate, tags} = useContext(MainContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onBlur',
  });

  // Pick image/video from devices library using Image Picker
  const pickFile = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.5,
        base64: true,
      });

      // get file info using FileSystem to validate the selected file size
      if (!result.cancelled) {
        const {type} = result;
        const fileInfo = await FileSystem.getInfoAsync(result.uri);
        if (!fileInfo?.size) {
          Alert.alert(
            'Failed to Select',
            'file size is unknown, please select another file.'
          );
          return;
        }

        // format size correctly and check the file type then check size accordingly
        const fileSize = fileInfo.size / 1024 / 1024;
        if (type === 'image' || type === 'audio') {
          fileSize > 5 &&
            alert(
              `Image/Audio size must be smaller than 5MB, please choose another file`
            );
        }
        if (type === 'video') {
          setImage(null);
          if (fileSize > 50) {
            alert(
              `Video size must be smaller than 50MB, please choose another file`
            );
          }
        }

        setImage(result.uri);
        setFileSelected(true);
        setType(result.type);
      }
    } catch (error) {
      console.info(error);
    }
  };

  // reset  fields
  const reset = () => {
    setFileSelected(false);
    setValue('title', '');
    setValue('description', '');
  };

  // reset when user leaves the view
  useFocusEffect(
    useCallback(() => {
      return () => reset();
    }, [])
  );

  const LoadingIndicator = () => <Spinner size="small" status="basic" />;

  const onSubmit = async (data) => {
    // File must be selected to submit the post
    if (!fileSelected) {
      Alert.alert('Please, select a file');
      return;
    }

    // form data to get file extension to change it from jpg to jpeg
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    const filename = image.split('/').pop();
    let fileExtension = filename.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
    // append fomData with correct avatar data then make
    // a post request using postMedia function
    formData.append('file', {
      uri: image,
      name: filename,
      type: type + '/' + fileExtension,
    });
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await postMedia(formData, token);

      // Go through selected tags array and post tags individually using postTag hook
      for (let i = 0; i < tags.length; i++) {
        if (!(tags[i] === 'None')) {
          // Tagname which will be posted to server. AppId identifies this apps tags.
          // Tag divider is used to split the tag from full tag
          const fullTag =
            Constants.manifest.extra.pvtAppId + tagDivider + tags[i];
          console.log(fullTag);
          await postTag(
            {
              file_id: response.file_id,
              tag: fullTag,
            },
            token
          );
        }
      }

      const tagResponse = await postTag(
        {file_id: response.file_id, tag: Constants.manifest.extra.pvtAppId},
        token
      );
      tagResponse &&
        Alert.alert('File', 'uploaded', [
          {
            text: 'OK',
            onPress: () => {
              reset();
              setUpdate(update + 1);
              navigation.navigate('Home');
            },
          },
        ]);
    } catch (error) {
      console.log('onSubmit upload image error', error);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}}>
      <Layout
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={pickFile} activeOpacity={0.7}>
          {image === undefined ? (
            <Image
              source={require('../assets/uploadDefaultImg.png')}
              style={styles.defaultImage}
            />
          ) : (
            <Image source={{uri: image}} style={styles.image} />
          )}

          <Text
            style={{textAlign: 'center', marginTop: 5}}
            appearance="hint"
            category="p2"
          >
            Select a file by clicking on the image
          </Text>
        </TouchableOpacity>
      </Layout>

      <Layout style={styles.modalContent}>
        <ImageBackground
          source={require('../assets/drawerBg.png')}
          style={styles.bgImage}
        />
        <SelectTags />
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Please enter a title.',
            },
            minLength: {
              value: 3,
              message: 'The title has to be at least 5 characters long.',
            },
            maxLength: {
              value: 55,
              message: "The title's maximum length is 50 characters long.",
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="Enter a title*"
              style={[styles.title, styles.input]}
              textStyle={styles.inputText}
              status={errors.title ? 'warning' : 'basic'}
              caption={errors.title && errors.title.message}
            />
          )}
          name="title"
        />

        <Controller
          control={control}
          rules={{
            maxLength: {
              value: 1000,
              message: 'Description maximum length is 1000 characters.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              style={styles.input}
              onBlur={onBlur}
              multiline={true}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              placeholder="Description"
              status={errors.description ? 'warning' : 'basic'}
              caption={errors.description && errors.description.message}
              textStyle={[styles.description, styles.inputText]}
            />
          )}
          name="description"
        />
        <Button onPress={pickFile} style={styles.button}>
          Pick a file
        </Button>
        <Button
          accessoryLeft={loading && LoadingIndicator}
          onPress={handleSubmit(onSubmit)}
          style={[styles.button, {backgroundColor: '#26A96C', marginTop: 10}]}
          tt
        >
          Post
        </Button>
      </Layout>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: '140%',
    bottom: '-80%',
  },
  input: {
    width: '90%',
    borderRadius: 20,
    marginVertical: 7,
  },
  inputText: {
    fontSize: 16,
    fontFamily: 'JetBrainsMonoReg',
  },
  description: {
    height: 100,
    textAlignVertical: 'top',
  },
  defaultImage: {
    width: undefined,
    height: 150,
    aspectRatio: 3 / 2,
    resizeMode: 'contain',
    marginTop: 30,
  },
  image: {
    width: undefined,
    height: 250,
    aspectRatio: 3 / 2,
    resizeMode: 'contain',
    marginTop: 10,
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    width: '90%',
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
