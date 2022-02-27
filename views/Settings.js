import React, {useContext} from 'react';
import {PropTypes} from 'prop-types';
import {Button, Layout} from '@ui-kitten/components';
import {ThemeContext} from '../contexts/ThemeContext';

const Settings = ({navigation}) => {
  const themeContext = useContext(ThemeContext);
  return (
    <Layout style={{height: '100%'}}>
      <Button onPress={themeContext.toggleTheme}>Toggle dark mode</Button>
    </Layout>
  );
};

Settings.propTypes = {
  navigation: PropTypes.object,
};

export default Settings;
