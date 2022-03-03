import {StyleSheet} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useRating} from '../hooks/ApiHooks';
import {PropTypes} from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Icon, Text} from '@ui-kitten/components';
import {ThemeContext} from '../contexts/ThemeContext';

const SavePost = ({file}) => {
  const {user, saveUpdate, setSaveUpdate} = useContext(MainContext);
  const {postRating, deleteRating, getRatedByFileId} = useRating();
  const [color, setColor] = useState();
  const [savedStatus, setSavedStatus] = useState(false);
  const pulseIconRef = useRef();
  const themeContext = useContext(ThemeContext);

  const fetchSaved = async () => {
    try {
      const savedPost = await getRatedByFileId(file.file_id);
      setSavedStatus(false);
      setColor('#000');
      savedPost.forEach((saved) => {
        if (saved.user_id === user.user_id) {
          setSavedStatus(true);
          setColor('blue');
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      pulseIconRef.current.startAnimation();
    }
  };

  const save = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await postRating(file.file_id, token);
      if (res) {
        setSavedStatus(true);
        setSaveUpdate(saveUpdate + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const unSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await deleteRating(file.file_id, token);
      if (res) {
        setSavedStatus(false);
        setSaveUpdate(saveUpdate + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, [saveUpdate]);

  const saveIcon = () => (
    <Icon
      ref={pulseIconRef}
      color={themeContext.theme === 'light' || savedStatus ? color : 'white'}
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
      style={styles.button}
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
