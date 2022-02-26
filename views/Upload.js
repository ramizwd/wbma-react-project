import {
  Text,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {Input, Button} from '@ui-kitten/components';
import React, {useCallback, useContext, useState} from 'react';
import {PropTypes} from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {appId} from '../utils/variables';
import {useFocusEffect} from '@react-navigation/native';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useTag} from '../hooks/ApiHooks';
import Constants from 'expo-constants';

// This view is for uploading a new post
const Upload = ({navigation}) => {
  const imageUri = 'https://place-hold.it/300x200&text=Choose';
  const [image, setImage] = useState();
  const [imageSelected, setImageSelected] = useState(false);
  const [type, setType] = useState('');
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setImageSelected(true);
      setType(result.type);
    }
  };

  const reset = () => {
    setImage(imageUri);
    setImageSelected(false);
    setValue('title', '');
    setValue('description', '');
  };

  useFocusEffect(
    useCallback(() => {
      return () => reset();
    }, [])
  );

  // When formdata is submitted
  const onSubmit = async (data) => {
    // File must be selected to submit the post
    if (!imageSelected) {
      Alert.alert('Please, select a file');
      return;
    }
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    const filename = image.split('/').pop();
    let fileExtension = filename.split('.').pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
    formData.append('file', {
      uri: image,
      name: filename,
      type: type + '/' + fileExtension,
    });
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await postMedia(formData, token);

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
    <KeyboardAvoidingView style={styles.container}>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Please enter a descriptive title.'},
          minLength: {
            value: 5,
            message: 'The title has to be at least 5 characters long.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Enter a descriptive title"
            style={[styles.title, styles.input]}
            textStyle={[styles.inputText]}
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
            value: 300,
            message: 'Description maximum length is 300 characters.',
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
            placeholder="Description (optional)"
            status={errors.description ? 'warning' : 'basic'}
            caption={errors.description && errors.description.message}
            textStyle={[styles.description, styles.inputText]}
          />
        )}
        name="description"
      />
      {imageSelected ? (
        <Image source={{uri: image}} style={styles.image} onPress={pickFile} />
      ) : (
        <Text>No file selected</Text>
      )}
      <Button onPress={pickFile} style={styles.button}>
        Choose file
      </Button>
      <Button
        onPress={handleSubmit(onSubmit)}
        style={[styles.button, {backgroundColor: '#26A96C', marginTop: 20}]}
      >
        Submit
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '80%',
  },
  input: {
    width: '60%',
    borderRadius: 20,
    marginVertical: 10,
  },
  inputText: {fontSize: 18},

  description: {
    minHeight: '30%',
    textAlignVertical: 'top',
  },
  image: {
    width: undefined,
    height: '20%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  button: {
    borderRadius: 20,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
