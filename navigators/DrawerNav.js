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
  Button,
} from '@ui-kitten/components';
import {EvilIconsPack} from '../evil-icons';
import {IonIconsPack} from '../ion-icons';
import Single from '../views/Single';
import Avatar from '../components/Avatar';
import ModifyProfile from '../views/ModifyProfile';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Messaging from '../views/Messaging';
import Search from '../views/Search';
import Login from '../views/Login';
import Register from '../views/Register';
import Upload from '../views/Upload';
import ModifyPost from '../views/ModifyPost';
import UserProfile from '../views/UserProfile';
import {ThemeContext} from '../contexts/ThemeContext';
import {useFonts} from 'expo-font';

const Stack = createNativeStackNavigator();
const {Navigator, Screen} = createDrawerNavigator();

const HomeIcon = () => {
  const themeContext = useContext(ThemeContext);
  return (
    <Icon
      name="home-outline"
      pack="ionIcons"
      style={styles.icons}
      color={themeContext.theme === 'light' ? 'black' : '#8F9BB3'}
    />
  );
};

const ProfileIcon = () => {
  const themeContext = useContext(ThemeContext);
  return (
    <Icon
      name="person-outline"
      pack="ionIcons"
      style={styles.icons}
      color={themeContext.theme === 'light' ? 'black' : '#8F9BB3'}
    />
  );
};

const ChatIcon = () => {
  const themeContext = useContext(ThemeContext);
  return (
    <Icon
      name="chatbubbles-outline"
      pack="ionIcons"
      style={styles.icons}
      color={themeContext.theme === 'light' ? 'black' : '#8F9BB3'}
    />
  );
};

const SearchIcon = () => {
  const themeContext = useContext(ThemeContext);
  return (
    <Icon
      name="search-outline"
      pack="ionIcons"
      style={styles.icons}
      color={themeContext.theme === 'light' ? 'black' : '#8F9BB3'}
    />
  );
};

// const SettingsIcon = () => {
//   const themeContext = useContext(ThemeContext);
//   return (
//     <Icon
//       name="settings-outline"
//       pack="ionIcons"
//       style={styles.icons}
//       color={themeContext.theme === 'light' ? 'black' : '#8F9BB3'}
//     />
//   );
// };

const LogoutIcon = () => {
  const themeContext = useContext(ThemeContext);
  return (
    <Icon
      name="log-out-outline"
      pack="ionIcons"
      style={styles.icons}
      color={themeContext.theme === 'light' ? 'black' : '#8F9BB3'}
    />
  );
};

const moonIcon = () => {
  const themeContext = useContext(ThemeContext);
  return (
    <Icon
      name={themeContext.theme === 'light' ? 'moon-outline' : 'moon'}
      pack="ionIcons"
      style={[styles.icons, {transform: [{scaleX: -1}]}]}
      color={themeContext.theme === 'light' ? '#000' : '#F5CB5C'}
    />
  );
};

const SearchIconBold = (props) => (
  <Icon {...props} name="search" pack="ionIcons" />
);

const DrawerContent = ({navigation, state}) => {
  const {setLoggedIn, user} = useContext(MainContext);
  const themeContext = useContext(ThemeContext);

  const Header = () => (
    <Layout style={styles.header}>
      <ImageBackground
        style={[styles.backgroundImg, styles.profileContainer]}
        source={require('../assets/drawerBg.png')}
      >
        <Avatar avatarSize="giant" userAvatar={user.user_id} />
        <Text style={styles.profileName} category="h6">
          {user.full_name ? user.full_name : user.username}
        </Text>
        <Button
          accessoryLeft={moonIcon}
          onPress={themeContext.toggleTheme}
          activeOpacity={0.7}
          appearance="ghost"
          style={{top: '25%', left: '30%', height: 47}}
        ></Button>
      </ImageBackground>
    </Layout>
  );

  const onLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel'},
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          setLoggedIn(false);
          themeContext.theme === 'dark' && themeContext.toggleTheme();
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
          style={styles.drawerItem}
          accessoryLeft={HomeIcon}
          title={(evaProps) => (
            <Text
              {...evaProps}
              style={[
                evaProps.style,
                themeContext.theme === 'dark'
                  ? [styles.drawerText, {color: 'white'}]
                  : [styles.drawerText],
              ]}
            >
              Home
            </Text>
          )}
        />
        <DrawerItem
          title={(evaProps) => (
            <Text
              {...evaProps}
              style={[
                evaProps.style,
                themeContext.theme === 'dark'
                  ? [styles.drawerText, {color: 'white'}]
                  : [styles.drawerText],
              ]}
            >
              Profile
            </Text>
          )}
          style={styles.drawerItem}
          accessoryLeft={ProfileIcon}
        />
        <DrawerItem
          title={(evaProps) => (
            <Text
              {...evaProps}
              style={[
                evaProps.style,
                themeContext.theme === 'dark'
                  ? [styles.drawerText, {color: 'white'}]
                  : [styles.drawerText],
              ]}
            >
              Messages
            </Text>
          )}
          style={styles.drawerItem}
          accessoryLeft={ChatIcon}
        />
        <DrawerItem
          title={(evaProps) => (
            <Text
              {...evaProps}
              style={[
                evaProps.style,
                themeContext.theme === 'dark'
                  ? [styles.drawerText, {color: 'white'}]
                  : [styles.drawerText],
              ]}
            >
              Explore
            </Text>
          )}
          style={styles.drawerItem}
          accessoryLeft={SearchIcon}
        />
      </Drawer>
      <DrawerItem
        title={(evaProps) => (
          <Text
            {...evaProps}
            style={[
              evaProps.style,
              themeContext.theme === 'dark'
                ? [styles.drawerText, {color: 'white'}]
                : [styles.drawerText],
            ]}
          >
            Logout
          </Text>
        )}
        style={{paddingBottom: 40}}
        onPress={onLogout}
        accessoryLeft={LogoutIcon}
      />
    </>
  );
};

const DrawerScreen = ({navigation}) => (
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
      headerTitleStyle: {
        fontFamily: 'IBMPlexMonoMed',
      },

      headerRight: () => (
        <Button
          onPress={() => navigation.navigate('Explore')}
          appearance="ghost"
          accessoryRight={SearchIconBold}
          style={{marginRight: 10, width: 30}}
        />
      ),
    }}
    drawerContent={(props) => <DrawerContent {...props} />}
  >
    <Screen name="Home" component={Home} />
    <Screen name="Profile" component={Profile} />
    <Screen name="Messaging" component={Messaging} />
    <Screen
      name="Explore"
      component={Search}
      initialParams={{autoSearch: false, tag: ''}}
    />
  </Navigator>
);

const StackScreen = () => {
  const {loggedIn} = useContext(MainContext);
  const [loaded] = useFonts({
    JetBrainsMonoReg: require('../assets/fonts/JetBrainsMono/JetBrainsMonoRegular.ttf'),
    IBMPlexMonoMed: require('../assets/fonts/IBMPlexMono/IBMPlexMonoMedium.ttf'),
  });

  if (!loaded) {
    return null;
  }
  return (
    <Stack.Navigator>
      {loggedIn ? (
        <>
          <Stack.Screen
            name="Drawer"
            component={DrawerScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Upload post"
            component={Upload}
            options={{
              title: 'Upload Post',
              headerTitleStyle: {
                fontFamily: 'JetBrainsMonoReg',
              },
            }}
          ></Stack.Screen>
          <Stack.Screen
            options={{
              title: 'Edit profile',
              headerTitleStyle: {
                fontFamily: 'JetBrainsMonoReg',
              },
            }}
            name="ModifyProfile"
            component={ModifyProfile}
          ></Stack.Screen>
          <Stack.Screen
            name="Single post"
            options={{
              title: 'Post',
              headerTitleStyle: {
                fontFamily: 'JetBrainsMonoReg',
              },
            }}
            component={Single}
          ></Stack.Screen>
          <Stack.Screen
            name="Modify post"
            options={{
              title: 'Edit Post',
              headerTitleStyle: {
                fontFamily: 'JetBrainsMonoReg',
              },
            }}
            component={ModifyPost}
          ></Stack.Screen>
          <Stack.Screen
            name="User profile"
            component={UserProfile}
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
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'JetBrainsMonoReg',
          },
        }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    const changeTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(changeTheme);
  };

  return (
    <>
      <IconRegistry icons={[EvilIconsPack, IonIconsPack]} />
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <ApplicationProvider {...eva} theme={eva[theme]}>
          <NavigationContainer>
            <StackScreen />
          </NavigationContainer>
        </ApplicationProvider>
      </ThemeContext.Provider>
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
    marginHorizontal: 15,
    fontFamily: 'JetBrainsMonoReg',
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
  drawerText: {
    fontSize: 14,
    fontFamily: 'JetBrainsMonoReg',
  },
});

DrawerContent.propTypes = {
  navigation: PropTypes.object,
  state: PropTypes.object,
};
DrawerScreen.propTypes = {
  navigation: PropTypes.object,
};
export default DrawerNavigator;
