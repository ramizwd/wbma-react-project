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
    console.log('data', data);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await putMedia(data, token, file.file_id);
      response &&
        Alert.alert(' ', 'Your post has been successfully modified!', [
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
        rules={{required: true}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Enter the title"
            errorMessage={errors.title && 'This is required.'}
            style={[styles.title, styles.input]}
            textStyle={[styles.inputText]}
          />
        )}
        name="title"
      />
      <Controller
        control={control}
        rules={{
          maxLength: 300,
          required: true,
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
            errorMessage={errors.description && 'This is required.'}
            textStyle={[styles.description, styles.inputText]}
          />
        )}
        name="description"
      />
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
  button: {
    borderRadius: 20,
  },
});

ModifyPost.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default ModifyPost;
