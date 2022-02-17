import React, {useContext, useEffect, useState} from 'react';
import {View, Alert, ScrollView, StyleSheet} from 'react-native';
import {PropTypes} from 'prop-types';
import {Button, Input} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import Card from '../components/Card';
import CardContent from '../components/CardContent';
import {List} from '@ui-kitten/components';

const Search = ({navigation}) => {
  const {searchMedia} = useMedia();
  const [searchResult, setSearchResult] = useState([]);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      title: '',
    },
    mode: 'onBlur',
  });
  const {mediaArray} = useMedia();

  const onSubmit = async (data) => {
    const token = await AsyncStorage.getItem('token');
    // console.log('search title:', data);

    try {
      const response = await searchMedia(data, token);
      const result = response.filter((x) => {
        return mediaArray.some((y) => {
          return x.file_id == y.file_id;
        });
      });
      if (result.length < 1) {
        Alert.alert('No match');
      }
      setSearchResult(result);
      // setSearchResult(response);
      // console.log('(Search) search result:', result);
      // console.log('mediaarry', mediaArray);
    } catch (error) {
      // console.error(error.message);
      console.log('search error');
    }
  };

  return (
    <View>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="Search by title"
            errorMessage={errors.title && errors.title.message}
          />
        )}
        name="title"
      />

      <Button title="Search" onPress={handleSubmit(onSubmit)}>
        Search
      </Button>

      <List
        data={searchResult}
        keyExtractor={(item) => item.file_id.toString()}
        renderItem={({item}) => (
          <CardContent post={item} navigation={navigation} />
        )}
      ></List>
    </View>
  );
};

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
