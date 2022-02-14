import {FlatList} from 'react-native';
import React from 'react';
import {useMedia} from '../hooks/ApiHooks';
import CardContent from './CardContent';

const Card = () => {
  const {mediaArray} = useMedia();

  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => <CardContent singleMedia={item} />}
    ></FlatList>
  );
};

export default Card;
