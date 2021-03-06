import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {tagDivider} from '../utils/variables';
import {useTag} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';

// Component for getting tags
const Tags = ({post, navigation}) => {
  const [tags, setTags] = useState([]);
  const {getTagsByFileId} = useTag();

  // Get tags for the post
  const getTags = async () => {
    try {
      const tags = await getTagsByFileId(post.file_id);
      setTags(tags);
    } catch (error) {
      console.error('getTags error', error);
    }
  };

  // fetch tags on component render
  useEffect(() => {
    getTags();
  }, []);

  // map the tags, if tag is found then render component
  // on tag press navigate to Explore, send autoSearch and the tag in route parameters
  return (
    <Layout style={styles.tagContainer}>
      {tags.map(
        (tag) =>
          tag.tag.split(tagDivider)[1] != undefined && (
            <TouchableOpacity
              style={styles.tagBg}
              key={tag.tag_id}
              onPress={() =>
                navigation.navigate('Explore', {
                  autoSearch: true,
                  tag: tag.tag.split(tagDivider)[1],
                })
              }
            >
              <Text style={styles.tagText}>{tag.tag.split(tagDivider)[1]}</Text>
            </TouchableOpacity>
          )
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tagBg: {
    borderRadius: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    borderColor: 'black',
    borderWidth: 0.8,
  },
  tagText: {
    padding: 7,
    borderRadius: 100,
    fontSize: 13,
    color: 'white',
    backgroundColor: '#2684BA',
  },
});

Tags.propTypes = {
  post: PropTypes.object.isRequired,
  navigation: PropTypes.object,
};

export default Tags;
