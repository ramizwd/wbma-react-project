import React, {useContext, useEffect, useState} from 'react';
import {View, Alert, ScrollView, StyleSheet} from 'react-native';
import {PropTypes} from 'prop-types';
import {Button, Input, Card} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';

const Search = ({navigation}) => {
  const {searchMedia} = useMedia();
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

  const onSubmit = async (data) => {
    const token = await AsyncStorage.getItem('token');
    // console.log('search title:', data);

    try {
      const response = await searchMedia(data, token);
      console.log('(Search) search result:', response);
    } catch (error) {
      console.error(error.message);
      console.log('search error');
    }
  };

  return (
    <ScrollView>
      <Card>
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

        <Button title="Search" onPress={handleSubmit(onSubmit)} />
      </Card>
    </ScrollView>
  );
};

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
