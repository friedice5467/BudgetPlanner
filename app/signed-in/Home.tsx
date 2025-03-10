import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from '../models/navigation';
import {BudgetComponent} from '../components/BudgetComponent';

function Home() {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <BudgetComponent isIntro={false} baseBudget={undefined} newUser={undefined} onProfileUpdate={undefined}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;
