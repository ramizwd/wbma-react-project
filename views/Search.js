import React, {useState, useCallback} from 'react';
import {View, Alert, StyleSheet} from 'react-native';
import {PropTypes} from 'prop-types';
import {Button, Input, Card} from '@ui-kitten/components';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia} from '../hooks/ApiHooks';
import CardContent from '../components/CardContent';
import {List} from '@ui-kitten/components';
import {useFocusEffect} from '@react-navigation/native';

const Search = ({navigation}) => {
  const {searchMedia} = useMedia();
  const [searchResult, setSearchResult] = useState([]);
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
    },
    mode: 'onBlur',
  });
  const {mediaArray} = useMedia();

  const onSubmit = async (data) => {
    const token = await AsyncStorage.getItem('token');

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
      setValue('title', '');
    } catch (error) {
      console.error(error.message);
    }
  };

  const reset = () => {
    setSearchResult([]);
    setValue('title', '');
  };

  useFocusEffect(
    useCallback(() => {
      return () => reset();
    }, [])
  );

  return (
    <View style={styles.container}>
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

        <Button title="Search" onPress={handleSubmit(onSubmit)}>
          Search
        </Button>
      </Card>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // alignItems: 'center',
    // justifyContent: 'center',
    height: '100%',
    // width: '100%',
    paddingTop: 0,
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
