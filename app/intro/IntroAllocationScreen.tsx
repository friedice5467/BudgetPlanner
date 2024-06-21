import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {BudgetComponent} from '../components/BudgetComponent';
import { IntroAllocationScreenProps } from '../models/navigation';
import { useProfile } from '../contexts/NewUserContext';
import { BaseBudget } from '../models/budget/budget';
import { AppUser } from '../models/appUser';

export const IntroAllocationScreen: React.FC<IntroAllocationScreenProps> = ({ route }) => {
const { baseBudget, user, onProfileUpdate } = useProfile();
  const theme = useTheme();
  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <BudgetComponent isIntro={true} baseBudget={baseBudget as BaseBudget} newUser={user as AppUser} onProfileUpdate={onProfileUpdate}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default IntroAllocationScreen;
