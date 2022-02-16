import 'react-native-gesture-handler';
import * as React from 'react';
import DrawerNavigator from './navigators/DrawerNav';
import {StatusBar} from 'react-native';
import {MainProvider} from './contexts/MainContext';

const App = () => {
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
