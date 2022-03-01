import 'react-native-gesture-handler';
import * as React from 'react';
import DrawerNavigator from './navigators/DrawerNav';
import {StatusBar} from 'react-native';
import {MainProvider} from './contexts/MainContext';
import {useFonts} from 'expo-font';

const App = () => {
  const [loaded] = useFonts({
    JetBrainsMonoReg: require('./assets/fonts/JetBrainsMono/JetBrainsMonoRegular.ttf'),
    IBMPlexMonoMed: require('./assets/fonts/IBMPlexMono/IBMPlexMonoMedium.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <MainProvider>
        <DrawerNavigator />
      </MainProvider>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
