import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {tagDivider} from '../utils/variables';
import {useTag} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';

export default function Tags({post}) {
  const [tags, setTags] = useState([]);
  const {getTagsByFileId} = useTag();
  const [color, setColor] = useState({backgroundColor: '#E6E8E6'});

  // Get tags for the post
  const getTags = async () => {
    console.log('tags', tags.length);
    try {
      const tags = await getTagsByFileId(post.file_id);
      setTags(tags);
      console.log('tags', tags);
    } catch (error) {
      console.error('getTags error', error);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  return (
    <Layout style={styles.tagContainer}>
      {tags.map(
        (tag) =>
          tag.tag.split(tagDivider)[1] != undefined && (
            <TouchableOpacity style={styles.tagBg} key={tag.tag_id}>
              <Text
                style={[
                  styles.tagText,
                  {backgroundColor: color.backgroundColor},
                ]}
              >
                {tag.tag.split(tagDivider)[1]}
              </Text>
            </TouchableOpacity>
          )
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tagBg: {
    borderRadius: 100,
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
  },
});

Tags.propTypes = {
  post: PropTypes.object.isRequired,
};
