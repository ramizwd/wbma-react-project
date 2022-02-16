import React from 'react';
import {useMedia} from '../hooks/ApiHooks';
import CardContent from './CardContent';
import {StyleSheet} from 'react-native';
import {List} from '@ui-kitten/components';

const Card = () => {
  const {mediaArray} = useMedia();

  return (
    <>
      <List
        contentContainerStyle={styles.contentContainer}
        data={mediaArray}
        keyExtractor={(item) => item.file_id.toString()}
        renderItem={({item}) => <CardContent post={item} />}
      ></List>
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});

export default Card;
