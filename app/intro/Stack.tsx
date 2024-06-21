import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {IntroScreen} from './IntroScreen';
import {IntroAllocationScreen} from './IntroAllocationScreen';
import {IntroStackParamList} from '../models/navigation';
import {AppUser} from '../models/appUser';
import { ProfileProvider } from '../contexts/NewUserContext';
import { useTheme } from 'react-native-paper';

const IntroStack = createStackNavigator<IntroStackParamList>();

const IntroNavigator: React.FC<{
  onProfileUpdate: (user: AppUser) => void;
}> = ({onProfileUpdate}) => {
    const theme = useTheme();

  return (
    <ProfileProvider onProfileUpdate={onProfileUpdate}>
    <IntroStack.Navigator
      initialRouteName="IntroScreen"
      screenOptions={{headerShown: true}}>
      <IntroStack.Screen
        name="IntroScreen"
        component={IntroScreen}
        options={{headerShown: false}}
      />
      <IntroStack.Screen
        name="IntroAllocationScreen"
        component={IntroAllocationScreen}
        options={{headerTitle: 'Allocate Your Monthly Budget', headerTitleStyle:{color: theme.colors.onSurface}, headerStyle:{backgroundColor: theme.colors.surface}}}
      />
    </IntroStack.Navigator>
    </ProfileProvider>
  );
};

export default IntroNavigator;
