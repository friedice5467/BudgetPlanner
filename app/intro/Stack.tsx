import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {IntroScreen} from './IntroScreen';
import {IntroAllocationScreen} from './IntroAllocationScreen';
import {IntroStackParamList} from '../models/navigation';
import {AppUser} from '../models/appUser';
import { ProfileProvider } from '../contexts/NewUserContext';

const IntroStack = createStackNavigator<IntroStackParamList>();

const IntroNavigator: React.FC<{
  onProfileUpdate: (user: AppUser) => void;
}> = ({onProfileUpdate}) => {
  return (
    <ProfileProvider onProfileUpdate={onProfileUpdate}>
    <IntroStack.Navigator
      initialRouteName="IntroScreen"
      screenOptions={{headerShown: false}}>
      <IntroStack.Screen
        name="IntroScreen"
        component={IntroScreen}
      />
      <IntroStack.Screen
        name="IntroAllocationScreen"
        component={IntroAllocationScreen}
      />
    </IntroStack.Navigator>
    </ProfileProvider>
  );
};

export default IntroNavigator;
