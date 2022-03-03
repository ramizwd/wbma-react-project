import React, {useState, useCallback, useContext} from 'react';
import {Alert, Keyboard, StyleSheet, TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';
import {
  Button,
  Icon,
  Layout,
  List,
  OverflowMenu,
  MenuItem,
  AutocompleteItem,
  Autocomplete,
} from '@ui-kitten/components';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMedia, useTag} from '../hooks/ApiHooks';
import CardContent from '../components/CardContent';
import {useFocusEffect} from '@react-navigation/native';
import Constants from 'expo-constants';
import {tagDivider} from '../utils/variables';
import {ThemeContext} from '../contexts/ThemeContext';

const filter = (item, query) =>
  item.title.toLowerCase().includes(query.toLowerCase());

// Search view that takes navigation props can search posts by title or category
const Search = ({navigation}) => {
  const [searchResult, setSearchResult] = useState([]);
  const [visible, setVisible] = useState(false);
  const [searchByTag, setSearchByTag] = useState(false);
  const {searchMedia} = useMedia();
  // const [value, setAutoVal] = useState(null);
  const {control, handleSubmit, setValue} = useForm({
    defaultValues: {
      title: '',
    },
    mode: 'onBlur',
  });
  const {mediaArray} = useMedia();
  const {getFilesByTag} = useTag();
  const [data, setData] = useState(mediaArray);

  // submit search keyword by using searchMedia from ApiHooks
  const onSubmit = async (data) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = searchByTag
        ? await getFilesByTag(
            Constants.manifest.extra.pvtAppId + tagDivider + data.title
          )
        : await searchMedia(data, token);

      const result = response.filter((x) => {
        return mediaArray.some((y) => {
          return x.file_id == y.file_id;
        });
      });

      if (result.length < 1) {
        Alert.alert('No match');
      }
      setSearchResult(result);
      Keyboard.dismiss();
      setValue('title', '');
    } catch (error) {
      Alert.alert('Search error');
      console.error(error.message);
    }
  };

  const searchIcon = (props) => {
    const themeContext = useContext(ThemeContext);

    return (
      <TouchableOpacity activeOpacity={0.5} onPress={handleSubmit(onSubmit)}>
        <Icon
          {...props}
          name="search"
          pack="ionIcons"
          color={themeContext.theme === 'light' ? 'black' : 'white'}
        />
      </TouchableOpacity>
    );
  };

  const optionsIcon = () => {
    const themeContext = useContext(ThemeContext);

    return (
      <Icon
        name="options-outline"
        pack="ionIcons"
        style={{height: 20}}
        color={themeContext.theme === 'light' ? 'black' : 'white'}
      />
    );
  };

  // reset search result and text input field
  const reset = () => {
    setSearchResult([]);
    setValue('title', '');
  };

  // when user switch away from this view, call reset function
  useFocusEffect(
    useCallback(() => {
      return () => reset();
    }, [])
  );

  const searchBtn = () => (
    <Button
      onPress={() => {
        setVisible(true);
      }}
      accessoryRight={optionsIcon}
      appearance="ghost"
      style={styles.optIcon}
    />
  );

  const renderOption = (item, index) => (
    <AutocompleteItem key={index} title={item.title} />
  );

  const onSelect = (index) => {
    console.log(mediaArray[index].title);
    setValue('title', data[index].title);
  };

  return (
    <Layout style={styles.container}>
      <Layout>
        <Layout style={styles.searchContainer}>
          <OverflowMenu
            visible={visible}
            anchor={searchBtn}
            onBackdropPress={() => setVisible(false)}
          >
            <MenuItem
              title="Search By Title"
              onPress={() => {
                setSearchByTag(false);
                setVisible(false);
              }}
            />
            <MenuItem
              title="Search By Tag"
              onPress={() => {
                setSearchByTag(true);
                setVisible(false);
              }}
            />
          </OverflowMenu>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required.'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Autocomplete
                onBlur={onBlur}
                accessoryRight={searchIcon}
                value={value}
                autoCapitalize="none"
                placeholder={!searchByTag ? 'Search by title' : 'Search by tag'}
                onSelect={(i) => {
                  onSelect(i);
                }}
                onChangeText={
                  !searchByTag
                    ? (val) => {
                        onChange(val);
                        setValue(val);
                        setData(mediaArray.filter((item) => filter(item, val)));
                      }
                    : onChange
                }
                style={styles.search}
              >
                {!searchByTag && data.map(renderOption)}
              </Autocomplete>
            )}
            name="title"
          />
        </Layout>
      </Layout>

      <List
        data={searchResult}
        keyExtractor={(item) => item.file_id.toString()}
        renderItem={({item}) => (
          <CardContent post={item} navigation={navigation} />
        )}
      ></List>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
    height: '102%',
    marginTop: -10,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 10,
    marginTop: 20,
  },
  search: {
    padding: 5,
    width: 350,
    borderRadius: 20,
  },
  optIcon: {},
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
