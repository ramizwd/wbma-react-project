
# Moment - React Native project
This is a school project for the second year third period Metropolia students. It's a React Native social media application for sharing media and chatting with others.

# Getting started
- Clone the repository
```
git clone https://github.com/ramizwd/basicweb-project-backend.git
```
- Install Expo Go globally
```
npm install -g expo-cli
```
- Install NodeJS v16 or higher
	 [Node.js](https://nodejs.org/)
	 
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
- [Fix the Firebase timer warning](https://stackoverflow.com/a/58666279)
  1. Navigate to your node_modules/react-native/Libraries/Core/Timers/JSTimers.js file.   
  2. Look for the variable MAX_TIMER_DURATION_MS
  3. Change its value to 10000 * 1000
  4. Save the changes (with auto format turned off) and re-build your app.

- Run the app
```
npm start
```
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
| package.json             | Contains package names and versions with the app name                                       | 
