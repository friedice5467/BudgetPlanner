import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from '../models/navigation';

function Analysis() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text>Analysis</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Analysis;
