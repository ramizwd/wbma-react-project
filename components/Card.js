import React from 'react';
import {useMedia} from '../hooks/ApiHooks';
import CardContent from './CardContent';
import {List} from '@ui-kitten/components';

const Card = () => {
  const {mediaArray} = useMedia();

  return (
    <List
      data={mediaArray}
      keyExtractor={(item) => item.file_id.toString()}
      renderItem={({item}) => <CardContent post={item} />}
    ></List>
  );
};

export default Card;
