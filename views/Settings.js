import React, {useContext} from 'react';
import {PropTypes} from 'prop-types';
import {Button, Layout, Card} from '@ui-kitten/components';
import {ThemeContext} from '../contexts/ThemeContext';
import {Toggle} from '@ui-kitten/components';

const Settings = () => {
  const themeContext = useContext(ThemeContext);
  const [checked, setChecked] = React.useState(false);

  const onCheckedChange = async (isChecked) => {
    setChecked(isChecked);
    themeContext.toggleTheme();
  };

  return (
    <Layout
      style={{height: '100%', justifyContent: 'center', alignItems: 'center'}}
    >
      <Card style={{width: '85%', marginVertical: 10}}>
        <Toggle checked={checked} onChange={onCheckedChange}>
          {checked ? 'Dark' : 'Light'}
        </Toggle>
      </Card>
    </Layout>
  );
};

Settings.propTypes = {
  navigation: PropTypes.object,
};

export default Settings;
