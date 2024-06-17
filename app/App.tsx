import React, {useEffect} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {
  useTheme,
  Headline,
  Provider as PaperProvider,
} from 'react-native-paper';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {AlertsProvider} from 'react-native-paper-alerts';
import Orientation from 'react-native-orientation-locker';

import {useAuthState} from './contexts/AuthContext';
import SignedInStack from './signed-in/Stack';
import SignedOutStack from './signed-out/Stack';
import appJson from '../app.json';
import {useAppSettings} from './components/AppSettings';
import {AppUser} from './models/appUser';

export default function App() {
  const {
    isUserAuthenticated,
    initializing,
    setUser,
    introNeeded,
    setIntroNeeded,
  } = useAuthState();
  const appSettings = useAppSettings();
  const theme = useTheme();

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  const handleProfileUpdate = (updatedUser: AppUser) => {
    setUser(updatedUser);
    setIntroNeeded(false);
  };

  const renderContent = () => {
    if (initializing) {
      return (
        //TODO - CUSTOM LOADING SCREEN
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Headline style={styles.headline}>Loading...</Headline>
        </View>
      );
    }
    if (!isUserAuthenticated) {
      return <SignedOutStack />;
    }
    // if (introNeeded) {
    // }
    return <SignedInStack />;
  };

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={appSettings.currentTheme}>
        <AlertsProvider>
            <NavigationContainer
              linking={{
                prefixes: ['localhost'],
                config: {
                  screens: {
                    SignIn: '',
                    CreateAccount: 'account/create',
                    ForgotPassword: 'account/password/forgot',
                    PhoneSignIn: 'account/phone/login',
                    NotFound: '*',
                    Details: 'details',
                    User: 'user',
                    UserProfile: 'profile',
                    UserSettings: 'profile/edit',
                    Home: 'home',
                  },
                },
              }}
              documentTitle={{
                formatter: (options, route) =>
                  `${appJson.displayName} - ${options?.title ?? route?.name}`,
              }}
              theme={appSettings.currentTheme}>
              {renderContent()}
            </NavigationContainer>
        </AlertsProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headline: {
    marginTop: 20,
  },
});
