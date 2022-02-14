import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Messaging from '../views/Messaging';
import Notifications from '../views/Notifications';
import Search from '../views/Search';
import Settings from '../views/Search';
import Login from '../views/Login';
import Register from '../views/Register';
import {MainContext} from '../contexts/MainContext';
import Upload from '../views/Upload';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerScreen = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerType: 'slide',
        headerTitleAlign: 'center',
        headerStyle: {
          height: 90,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          backgroundColor: '#0496FF',
        },
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Messaging" component={Messaging} />
      <Drawer.Screen name="Notifications" component={Notifications} />
      <Drawer.Screen name="Explore" component={Search} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};

const DrawerNavigator = () => {
  const {loggedIn} = useContext(MainContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {loggedIn ? (
          <>
            <Stack.Screen
              name="Drawer"
              component={DrawerScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen name="Upload post" component={Upload}></Stack.Screen>
          </>
        ) : (
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
        )}
        <Stack.Screen name="Register" component={Register}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;
