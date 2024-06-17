/**
 * When compiling for mobile, it will search for index.js on root.
 */

import {AppRegistry} from 'react-native';
import App from './app/App';
import {name as appName} from './app.json';
import {AuthProvider} from './app/contexts/AuthContext';

const RootComponent = () => (
  <AuthProvider>
      <App />
  </AuthProvider>
);

AppRegistry.registerComponent(appName, () => RootComponent);
