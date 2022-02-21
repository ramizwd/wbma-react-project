import React, {useContext} from 'react';
import * as eva from '@eva-design/eva';
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
import {ApplicationProvider} from '@ui-kitten/components';
import ModifyProfile from '../views/ModifyProfile';
import Single from '../views/Single';
import ModifyPost from '../views/ModifyPost';

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
          height: 80,
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
      <Drawer.Screen name="Log out" component={Login} />
    </Drawer.Navigator>
  );
};

const StackScreen = () => {
  const {loggedIn} = useContext(MainContext);

  return (
    <Stack.Navigator>
      {loggedIn ? (
        <>
          <Stack.Screen
            name="Drawer"
            component={DrawerScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Upload post" component={Upload}></Stack.Screen>
          <Stack.Screen
            name="ModifyProfile"
            component={ModifyProfile}
          ></Stack.Screen>
          <Stack.Screen name="Single post" component={Single}></Stack.Screen>
          <Stack.Screen
            name="Modify post"
            component={ModifyPost}
          ></Stack.Screen>
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        ></Stack.Screen>
      )}
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerTitleAlign: 'center'}}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <NavigationContainer>
        <StackScreen />
      </NavigationContainer>
    </ApplicationProvider>
  );
};

export default DrawerNavigator;
