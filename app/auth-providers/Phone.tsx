import React, { Fragment, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Paragraph, TextInput, useTheme } from 'react-native-paper';
import { CountryPicker, CountryItem } from 'react-native-country-codes-picker'; // Correct import
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { AsYouType, parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import { useAlerts } from 'react-native-paper-alerts';
import { useAppSettings } from '../components/AppSettings';

function Phone(): JSX.Element {
  const [loading, setLoading] = useState(false);
  let confirmationRef = useRef<(verificationCode: null | string) => Promise<FirebaseAuthTypes.UserCredential | null> | null>(null);
  const [number, setNumber] = useState('+1 ');
  const [verification, setVerification] = useState('');
  const [countryCode, setCountryCode] = useState('US');
  const [visible, setVisible] = useState(false);

  const theme = useTheme();
  const appSettings = useAppSettings();
  const Alert = useAlerts();

  const onSelect = (item : CountryItem) => {
    setCountryCode(item.code);
    setNumber(`+${item.dial_code} `);
  };

  async function handlePhoneAuth() {
    if (!loading && confirmationRef.current) {
      setLoading(true);
      try {
        const result = await auth().signInWithPhoneNumber(number);
        (confirmationRef as React.MutableRefObject<(verificationCode: string) => Promise<FirebaseAuthTypes.UserCredential | null> | null>).current = result.confirm.bind(result);
      } catch (e) {
        setLoading(false);
        (confirmationRef as React.MutableRefObject<null>).current = null;
        const error = e as FirebaseAuthTypes.PhoneAuthError;
        Alert.alert(
          appSettings.t('phone-auth-error'),
          appSettings.t(error.code ?? 'unknownError'),
          [{text: appSettings.t('OK')}],
        );
      }
    }
  }

  function handleNumber(text: string) {
    const parsed = new AsYouType().input(text);
    setNumber(parsed);
  }

  function isValid() {
    const phoneNumber = parsePhoneNumberFromString(number, countryCode as CountryCode);
    return phoneNumber?.isValid() ?? false;
  }

  async function handleVerification() {
    if (!loading && confirmationRef.current) {
      setLoading(true);
      try {
        await confirmationRef.current(verification);
        (confirmationRef as React.MutableRefObject<null>).current = null;
      } catch (e) {
        setLoading(false);
        const error = e as FirebaseAuthTypes.PhoneAuthError;
        Alert.alert(
          appSettings.t('phone-auth-error'),
          appSettings.t(error.code ?? 'unknownError'),
          [{text: appSettings.t('OK')}],
        );
      }
    }
  }

  return confirmationRef.current ? (
    <Fragment>
      <TextInput
        keyboardType="number-pad"
        mode="outlined"
        label={appSettings.t('phoneVerificationCode')}
        value={verification}
        onChangeText={setVerification}
        autoComplete="sms-otp"
        style={styles.input}
      />
      <Button
        style={styles.submit}
        loading={loading}
        disabled={!verification}
        mode="contained"
        onPress={handleVerification}
      >
        {appSettings.t('phoneVerificationConfirm')}
      </Button>
    </Fragment>
  ) : (
    <Fragment>
      <Paragraph style={styles.paragraph}>
        {appSettings.t('phoneVerificationCountryInstructions')}
      </Paragraph>
      <CountryPicker
          show={visible} // Controls the visibility of the modal
          pickerButtonOnPress={(country) => {
            setCountryCode(country.code); 
            setNumber(country.dial_code + ' '); 
            setVisible(false); 
          }}
          inputPlaceholder="Select your country" 
          searchMessage="Search for your country" 
          lang="en" 
          enableModalAvoiding={true} 
          androidWindowSoftInputMode="pan" 
          disableBackdrop={false} // Keep backdrop enabled
          onBackdropPress={() => setVisible(false)} 
          initialState="+1" 
        />
      <Paragraph style={styles.paragraph}>
        {appSettings.t('phoneVerificationNumberInstructions')}
      </Paragraph>
      <TextInput
        keyboardType="number-pad"
        mode="outlined"
        label={appSettings.t('phoneVerificationNumberLabel')}
        value={number}
        onChangeText={handleNumber}
        autoComplete="tel"
        style={styles.input}
      />
      <Button
        style={styles.submit}
        loading={loading}
        disabled={!isValid()}
        mode="contained"
        onPress={handlePhoneAuth}
      >
        {appSettings.t('phoneVerificationNumberSubmit')}
      </Button>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  phoneCountry: {
    marginBottom: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraph: {
    marginBottom: 10,
  },
  submit: {
    marginTop: 20,
  },
  input: {
    marginBottom: 15,
  },
});

export default Phone;
