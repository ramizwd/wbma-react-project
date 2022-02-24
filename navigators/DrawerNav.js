import React, {useContext} from 'react';
import * as eva from '@eva-design/eva';
import {Alert, ImageBackground, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {
  ApplicationProvider,
  IconRegistry,
  Drawer,
  DrawerItem,
  Text,
  Layout,
  IndexPath,
  Icon,
} from '@ui-kitten/components';
import {EvilIconsPack} from '../evil-icons';
import {IonIconsPack} from '../ion-icons';

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

const HomeIcon = (props) => (
  <Icon name="home-outline" pack="ionIcons" style={styles.icons} />
);

const ProfileIcon = (props) => (
  <Icon name="person-outline" pack="ionIcons" style={styles.icons} />
);

const ChatIcon = (props) => (
  <Icon name="chatbubbles-outline" pack="ionIcons" style={styles.icons} />
);

const SearchIcon = (props) => (
  <Icon name="search-outline" pack="ionIcons" style={styles.icons} />
);

const SettingsIcon = (props) => (
  <Icon name="settings-outline" pack="ionIcons" style={styles.icons} />
);

const LogoutIcon = (props) => (
  <Icon name="log-out-outline" pack="ionIcons" style={{height: 20}} />
);

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
        appearance="noDivider"
      >
        <DrawerItem
          title="Home"
          style={styles.drawerItem}
          accessoryLeft={HomeIcon}
        />
        <DrawerItem
          title="Profile"
          style={styles.drawerItem}
          accessoryLeft={ProfileIcon}
        />
        <DrawerItem
          title="Messaging"
          style={styles.drawerItem}
          accessoryLeft={ChatIcon}
        />
        <DrawerItem title="Notifications" style={styles.drawerItem} />
        <DrawerItem
          title="Explore"
          style={styles.drawerItem}
          accessoryLeft={SearchIcon}
        />
        <DrawerItem
          title="Settings"
          style={styles.drawerItem}
          accessoryLeft={SettingsIcon}
        />
      </Drawer>
      <DrawerItem
        title="Log out"
        style={{paddingBottom: 40}}
        onPress={onLogout}
        accessoryLeft={LogoutIcon}
      />
    </>
  );
};

const DrawerScreen = (props) => (
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
      <IconRegistry icons={[EvilIconsPack, IonIconsPack]} />

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
    justifyContent: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  profileName: {
    marginHorizontal: 10,
  },
  backgroundImg: {
    width: 280,
    height: 300,
  },
  drawerItem: {
    paddingTop: 17,
    paddingBottom: 17,
  },
  icons: {
    height: 20,
  },
});

DrawerContent.propTypes = {
  navigation: PropTypes.object,
  state: PropTypes.object,
};

export default DrawerNavigator;
