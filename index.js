/**
 * @format
 */
import {LogBox} from 'react-native';
LogBox.ignoreLogs ([
  'This method is deprecated (as well as all React Native Firebase namespaced API)',
  'Method called was `collection`',
  'Method called was `orderBy`',
]);
import {AppRegistry} from 'react-native';
import {initializeApp} from '@react-native-firebase/app';
import App from './App';
import {name as appName} from './app.json';

initializeApp ();
AppRegistry.registerComponent (appName, () => App);
