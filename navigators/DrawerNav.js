import React, {useContext} from 'react';
import * as eva from '@eva-design/eva';
import {Alert, ImageBackground, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ApplicationProvider,
  IconRegistry,
  Drawer,
  DrawerItem,
  Text,
  Layout,
  IndexPath,
} from '@ui-kitten/components';
// import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {EvilIconsPack} from '../evil-icons';

import Single from '../views/Single';
import Avatar from '../components/Avatar';
import ModifyProfile from '../views/ModifyProfile';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Messaging from '../views/Messaging';
import Notifications from '../views/Notifications';
import Search from '../views/Search';
import Settings from '../views/Search';
import Login from '../views/Login';
import Register from '../views/Register';
import Upload from '../views/Upload';

const Stack = createNativeStackNavigator();
const {Navigator, Screen} = createDrawerNavigator();

const DrawerContent = ({navigation, state}) => {
  const {setLoggedIn, user} = useContext(MainContext);

  const Header = (props) => (
    <Layout style={styles.header}>
      <ImageBackground
        style={[styles.backgroundImg, styles.profileContainer]}
        source={require('../assets/drawerBg.png')}
      >
        <Avatar avatarSize="giant" />
        <Text style={styles.profileName} category="h6">
          {user.full_name ? user.full_name : user.username}
        </Text>
      </ImageBackground>
    </Layout>
  );

  const onLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {text: 'Cancel'},
      {
        text: 'Log out',
        onPress: async () => {
          await AsyncStorage.clear();
          setLoggedIn(false);
        },
      },
    ]);
  };

  return (
    <>
      <Drawer
        header={Header}
        selectedIndex={new IndexPath(state.index)}
        onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
      >
        <DrawerItem title="Home" />
        <DrawerItem title="Profile" />
        <DrawerItem title="Messaging" />
        <DrawerItem title="Notifications" />
        <DrawerItem title="Explore" />
        <DrawerItem title="Settings" />
      </Drawer>
      <DrawerItem
        title="Log out"
        style={{paddingBottom: 40}}
        onPress={onLogout}
      />
    </>
  );
};

const DrawerScreen = () => (
  <Navigator
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
    drawerContent={(props) => <DrawerContent {...props} />}
  >
    <Screen name="Home" component={Home} />
    <Screen name="Profile" component={Profile} />
    <Screen name="Messaging" component={Messaging} />
    <Screen name="Notifications" component={Notifications} />
    <Screen name="Explore" component={Search} />
    <Screen name="Settings" component={Settings} />
  </Navigator>
);

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
    <>
      <IconRegistry icons={EvilIconsPack} />

      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <StackScreen />
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 200,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    marginHorizontal: 10,
  },
  backgroundImg: {
    width: 250,
    height: 200,
  },
});

export default DrawerNavigator;
