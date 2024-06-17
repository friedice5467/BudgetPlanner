import {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {FirebaseError} from '@firebase/util';
import {useAlerts} from 'react-native-paper-alerts';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {useAppSettings} from '../components/AppSettings';
import ProviderButton from '../components/AuthProviderButton';
import {getProviderButtonTitle} from '../util/helpers';
import googleServices from '../../google-services.json';
const PROVIDER_ID = 'google.com';

function Google(): JSX.Element | null {
  const [loading, setLoading] = useState(false);
  const user = auth().currentUser;
  const Alert = useAlerts();
  const appSettings = useAppSettings();

  const {isOnlyProvider, title, variant} = getProviderButtonTitle(
    user,
    PROVIDER_ID,
  );

  async function handleGoogle() {
    if (!loading) {
      setLoading(true);

      try {
        await GoogleSignin.hasPlayServices();

        if (variant === 'UNLINK' && user) {
          await user.unlink(PROVIDER_ID);
          await user.reload();
        } else {
          await GoogleSignin.signIn();
          const {accessToken, idToken} = await GoogleSignin.getTokens();
          const credential = auth.GoogleAuthProvider.credential(
            idToken,
            accessToken,
          );

          if (variant === 'LINK' && user) {
            await user.linkWithCredential(credential);
            await user.reload();
          } else if (variant === 'SIGN_IN') {
            await auth().signInWithCredential(credential);
          }
        }
      } catch (e) {
        setLoading(false);
        const error = e as FirebaseError;
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
          case '-1':
            return Alert.alert(
              appSettings.t('googleAuthError'),
              appSettings.t('googleAuthCancelled'),
              [{text: appSettings.t('OK')}],
            );
          case statusCodes.IN_PROGRESS:
            return Alert.alert(
              appSettings.t('googleAuthError'),
              appSettings.t('googleAuthInProgress'),
              [{text: appSettings.t('OK')}],
            );
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            return Alert.alert(
              appSettings.t('googleAuthError'),
              appSettings.t('googleAuthPlayServices'),
              [{text: appSettings.t('OK')}],
            );
          default:
            switch (error.message) {
              case 'DEVELOPER_ERROR':
                console.info(
                  'Developer error during Google Auth, check: ' +
                    'https://github.com/react-native-google-signin/google-signin/blob/f21dd95a090f4f529748473e20515d6fc66db6bb/example/README.md#developer_error-or-code-10-on-android',
                );
                return Alert.alert(
                  appSettings.t('googleAuthError'),
                  appSettings.t('googleAuthConfigError'),
                  [{text: appSettings.t('OK')}],
                );
              default:
                // TODO get catalog of all errors and translate them
                return Alert.alert(
                  appSettings.t('googleAuthError'),
                  error.message,
                  [{text: appSettings.t('OK')}],
                );
            }
        }
      }
    }
  }

  useEffect(() => {
    // Extract the web client ID
    const webClientId = googleServices.client[0].oauth_client.find((client) => client.client_type === 3)?.client_id;
  
    GoogleSignin.configure({
      scopes: ['profile', 'email'],
      webClientId: webClientId,
    });
  }, []);

  if (isOnlyProvider) {
    return null;
  }

  return (
    <ProviderButton loading={loading} onPress={handleGoogle} type="google">
      {title}
    </ProviderButton>
  );
}

export default Google;
