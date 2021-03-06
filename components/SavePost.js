import {StyleSheet} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useRating} from '../hooks/ApiHooks';
import {PropTypes} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Icon, Text} from '@ui-kitten/components';
import {ThemeContext} from '../contexts/ThemeContext';

// component for saving and fetching posts using the Rating system from the API
const SavePost = ({file}) => {
  const {user, saveUpdate, setSaveUpdate} = useContext(MainContext);
  const {postRating, deleteRating, getRatedByFileId} = useRating();
  const [color, setColor] = useState();
  const [savedStatus, setSavedStatus] = useState(false);
  const pulseIconRef = useRef();
  const themeContext = useContext(ThemeContext);

  // Fetch rated(saved) and set the color to black
  // if user's saved then set color to blue
  const fetchSaved = async () => {
    try {
      const savedPost = await getRatedByFileId(file.file_id);
      setSavedStatus(false);
      setColor('#000');
      savedPost.forEach((saved) => {
        if (saved.user_id === user.user_id) {
          setSavedStatus(true);
          setColor('#2684BA');
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      pulseIconRef.current.startAnimation();
    }
  };

  // Send rating(save) request for the file
  const save = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await postRating(file.file_id, token);
      if (res) {
        setSavedStatus(true);
        setSaveUpdate(saveUpdate + 1);
      }
    } catch (error) {
      alert('Error saving, please check network connectivity.');
      console.error(error);
    }
  };

  // delete rating(save) from file
  const unSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await deleteRating(file.file_id, token);
      if (res) {
        setSavedStatus(false);
        setSaveUpdate(saveUpdate + 1);
      }
    } catch (error) {
      alert('Error un-saving, please check network connectivity.');
      console.error(error);
    }
  };

  // fetch saved on render
  useEffect(() => {
    fetchSaved();
  }, [saveUpdate]);

  // save icon
  const saveIcon = () => (
    <Icon
      ref={pulseIconRef}
      color={themeContext.theme === 'light' || savedStatus ? color : '#8F9BB3'}
      animation="pulse"
      name="tag"
      style={styles.icon}
    />
  );

  return (
    <Button
      onPress={() => {
        savedStatus ? unSave() : save();
      }}
      appearance="ghost"
      accessoryLeft={saveIcon}
      status="basic"
    >
      {(props) => (
        <Text {...props} style={styles.saveTxt}>
          {savedStatus ? 'saved' : 'save'}
        </Text>
      )}
    </Button>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: 30,
    width: 30,
  },
  saveTxt: {
    marginLeft: 5,
    fontFamily: 'JetBrainsMonoReg',
    fontSize: 14,
  },
});

SavePost.propTypes = {
  file: PropTypes.object,
};

export default SavePost;
