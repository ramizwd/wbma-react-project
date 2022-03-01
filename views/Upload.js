import {
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Input, Button, Layout, Icon} from '@ui-kitten/components';
import React, {useCallback, useContext, useState} from 'react';
import {PropTypes} from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {useFocusEffect} from '@react-navigation/native';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {tagDivider} from '../utils/variables';
import SelectTags from '../components/SelectTags';
import Constants from 'expo-constants';

// This view is for uploading a new post
const Upload = ({navigation}) => {
  const [image, setImage] = useState();
  const [imageSelected, setImageSelected] = useState(false);
  const [type, setType] = useState('');
  const {postMedia} = useMedia();
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
  const [panelProps] = useState({
    fullWidth: true,
    openLarge: false,
    showCloseButton: false,
    noBackgroundOpacity: false,
    closeOnTouchOutside: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
  });
  const [isPanelActive, setIsPanelActive] = useState(true);

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
    console.log('onSubmit tag', tags);
    // File must be selected to submit the post
    if (!imageSelected) {
      Alert.alert('Please, select a file');
      return;
    }
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    // formData.append('tag', data.tag);
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

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const optionsIcon = () => {
    return <Icon name="options-outline" pack="ionIcons" style={{height: 25}} />;
  };

  return (
    <Layout style={{flex: 1, backgroundColor: '#ECECEC'}}>
      <Layout
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ECECEC',
        }}
      >
        <TouchableOpacity onPress={pickFile} activeOpacity={0.7}>
          <Image
            source={
              image === undefined
                ? require('../assets/uploadDefaultImg.png')
                : {uri: image}
            }
            style={styles.image}
          />
        </TouchableOpacity>
      </Layout>

      <Button
        appearance="ghost"
        accessoryLeft={optionsIcon}
        style={{marginLeft: 'auto', bottom: 4}}
        onPress={() => {
          openPanel();
        }}
      ></Button>

      <SwipeablePanel
        {...panelProps}
        isActive={isPanelActive}
        style={{height: '90%'}}
      >
        <ScrollView style={{width: '100%'}}>
          <Layout style={styles.modalContent}>
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
              Choose a file
            </Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              style={[
                styles.button,
                {backgroundColor: '#26A96C', marginTop: 10},
              ]}
            >
              Post
            </Button>
          </Layout>
        </ScrollView>
      </SwipeablePanel>
    </Layout>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    alignItems: 'center',
  },
  input: {
    width: '90%',
    borderRadius: 20,
    marginVertical: 10,
  },
  inputText: {fontSize: 16},

  description: {
    height: 100,
    textAlignVertical: 'top',
  },
  image: {
    width: undefined,
    height: 330,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  button: {
    marginTop: 7,
    borderRadius: 10,
    width: '90%',
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
