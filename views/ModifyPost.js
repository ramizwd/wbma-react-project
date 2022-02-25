import React, {useContext} from 'react';
import {StyleSheet, Alert, KeyboardAvoidingView} from 'react-native';
import {PropTypes} from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import {Input, Button} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {useMedia} from '../hooks/ApiHooks';

// ModifyPost view that takes navigation and route props can modify title and description of one of user's selected post
const ModifyPost = ({navigation, route}) => {
  const {file} = route.params;
  const {update, setUpdate} = useContext(MainContext);
  const {putMedia} = useMedia();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: file.title,
      description: file.description,
    },
  });

  // submit form date by using putMedia from ApiHooks
  const onSubmit = async (data) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await putMedia(data, token, file.file_id);
      response &&
        Alert.alert('Success', 'Your post has been successfully modified!', [
          {
            text: 'Ok',
            onPress: () => {
              setUpdate(update + 1);
              navigation.navigate('Profile');
            },
          },
        ]);
    } catch (error) {
      console.error(error);
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
            placeholder="Enter the title"
            status={errors.title ? 'warning' : 'basic'}
            caption={errors.title && errors.title.message}
            style={[styles.title, styles.input]}
            textStyle={[styles.inputText]}
          />
        )}
        name="title"
      />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Please enter a description.'},
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
            placeholder="Description"
            status={errors.description ? 'warning' : 'basic'}
            caption={errors.description && errors.description.message}
            textStyle={[styles.description, styles.inputText]}
          />
        )}
        name="description"
      />

      <Button
        onPress={handleSubmit(onSubmit)}
        style={[styles.button, {backgroundColor: '#26A96C', marginTop: 20}]}
      >
        Save Changes
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
  image: {
    width: undefined,
    height: '20%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  inputText: {fontSize: 18},
  description: {
    minHeight: '30%',
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: 20,
  },
});

ModifyPost.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ModifyPost;
