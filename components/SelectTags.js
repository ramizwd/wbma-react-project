import React, {useContext, useEffect, useState} from 'react';
import {IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';
import {MainContext} from '../contexts/MainContext';

const SelectTags = () => {
  // Indexes which are selected from select menu
  const [languageIndex, setLanguageIndex] = useState(new IndexPath(0));
  const [themeIndex, setThemeIndex] = useState(new IndexPath(0));
  const {setTags} = useContext(MainContext);

  // Tag arrays
  const languageTags = ['None', 'Javascript', 'C', 'Java', 'C#'];
  const themeTags = ['None', 'help', 'meme', 'share'];

  // Get selected tags from arrays with selected index
  const selectedLanguage = languageTags[languageIndex.row];
  const selectedTheme = themeTags[themeIndex.row];

  // Render items in select menu
  const renderOption = (title) => <SelectItem key={title} title={title} />;

  // Change tags when new index is selected from select menu
  useEffect(() => {
    setTags([selectedLanguage, selectedTheme]);
  }, [languageIndex, themeIndex]);

  return (
    <Layout style={{flexDirection: 'row'}}>
      <Select
        style={{width: '30%'}}
        selectedIndex={languageIndex}
        onSelect={(index) => setLanguageIndex(index)}
        value={selectedLanguage}
        label="Language"
      >
        {languageTags.map(renderOption)}
      </Select>
      <Select
        style={{width: '30%'}}
        selectedIndex={themeIndex}
        onSelect={(index) => setThemeIndex(index)}
        value={selectedTheme}
        label="Theme"
      >
        {themeTags.map(renderOption)}
      </Select>
    </Layout>
  );
};

export default SelectTags;
