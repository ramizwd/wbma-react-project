import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Messaging from '../views/Messaging';
import Notifications from '../views/Notifications';
import Search from '../views/Search';
import Settings from '../views/Search';

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

const StackScreen = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Drawer"
          component={DrawerScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackScreen;
