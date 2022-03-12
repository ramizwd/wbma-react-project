


# Moment - React Native project
This is a school project for the second year third period Metropolia students. It's a React Native social media application for sharing media and chatting with others.

# App demo
[YouTube video](https://www.youtube.com/watch?v=lkSOLeSqTas) showing the application's features.

# Getting started
- Clone the repository
```
git clone https://github.com/ramizwd/basicweb-project-backend.git
```
- Install Expo Go globally
```
npm install -g expo-cli
```
- Install [NodeJS](https://nodejs.org/) v16 or higher
	 
- Navigate to the project and install dependencies
```
cd basicweb-project-backend
npm i
```
- Create your `.env` file
```
API_KEY=XXXX
AUTH_DOMAIN=XXXX
PROJECT_ID=XXXX
STORAGE_BUCKET=XXXX
MESSAGING_SENDER_ID=XXXX
APP_ID=XXXX
PVT_APP_ID=XXXX
```

- Run the app
```
npm start
```

## Notes
- If you want to get rid of the Firebase timer warning follow these [instructions](https://stackoverflow.com/a/58666279):
  1. Navigate to your node_modules/react-native/Libraries/Core/Timers/JSTimers.js file.   
  2. Look for the variable MAX_TIMER_DURATION_MS
  3. Change its value to 10000 * 1000
  4. Save the changes (with auto format turned off) and re-build your app.
  
 
- If you get a Firebase quota has been exceeded warning, then that means we ran out of reads or writes for the day and thus cannot use the chat. If you do not want to wait until next day then you can create your own Firebase database and copy the  configuration to the ```.env``` file in the project.

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **assets**          | Contains fonts, images, icons, and animations                                    |
| **node_modules**         | Contains all NPM dependencies                                                                |
| **components**             | Contains all the reusable project components                                                               |
| **config**              | Contains firebase configuration                                                   |
| **contexts**               | Contain the application Contexts  |
| **hooks**           | Contains the ApiHook file for API calls                           |
| **navigators**                | Contains the drawer navigator     
| **utils**           | Contains the app variables                           |        
| **views**           | Contains all the app views/screens                          |                                      
| App.js                   | Starting point for the app                                   |  
| evil-icons.js                  | Converts EvilIcons icon package to UI Kitten's                                  
| ion-icons.js                   | Converts IonIcons icon package to UI Kitten's
| app.config.js                   | For app configuration     
| babel.config.js                   | For converting JSX                                          
| package.json             | Contains package names and versions with the app name  
                                     
# Changes and fixes made from the feedbacks
### Additions & changes
- Added post button in multiple views.
- Added more padding to comments.
- Changed dark mode button to a lighter color for better visibility.
- Made the user info and password modification separate.
- Changed tag search from typing the tags to selecting them.
- Confusion with the navigation header search icon in Messages view - now it's only in Home and Profile views.
- Confusion with pick a file button in Upload view - now it's removed and choosing a file can only happen through pressing the file itself.
- Confusion with the alert message after uploading a file - now it specifies which type of file is uploaded.
- Added toggle password visibility button in modify profile as well.
- Drawer icon color to be lighter color instead of black for better visibility.

### Bugs fixed
- Profile view crashing for some users.
- Profile image doesn't update in drawer navigation header after it's changed.
- SwipeablePanel color fix in dark mode.
- SwipeablePanel input field popping behind navigation header.
- Messages view crash when a new use update their profile picture and open chat.
- Like button not working in Single view.
