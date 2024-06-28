import {FirebaseAuthTypes} from '@react-native-firebase/auth';

type ProviderID = 'google.com' | 'apple.com';

const providerNames = {
  'google.com': 'Google',
  'apple.com': 'Apple',
};

const providerTitles: {[key: string]: string} = {
  SIGN_IN: 'Sign in with',
  LINK: 'Link',
  UNLINK: 'Unlink',
};

/**
 * Return array of user auth providers
 */
export function getProviders(user: FirebaseAuthTypes.User | null): string[] {
  if (user) {
    return user.providerData.map(provider => provider.providerId);
  }

  return [];
}

export function getProviderButtonTitle(
  user: FirebaseAuthTypes.User | null,
  providerID: ProviderID,
) {
  const providers = getProviders(user);
  const isProvider = providers.includes(providerID);
  const isOnlyProvider = providers.length === 1 && isProvider;
  let variant = 'SIGN_IN';

  if (user) {
    variant = isProvider ? 'UNLINK' : 'LINK';
  }

  return {
    variant,
    title: `${providerTitles[variant]} ${providerNames[providerID]}`,
    isOnlyProvider,
  };
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function currencyFormatter(amount: string) : string {
  return parseFloat(amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

export function getItemDate(date: string): Date {
  const [month, year] = date.split('-');
  return new Date(`${year}-${month}-02`);
}
