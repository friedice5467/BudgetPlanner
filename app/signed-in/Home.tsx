import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, View, FlatList, TextInput} from 'react-native';
import {useTheme, Card, FAB, Text, ActivityIndicator} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {UserContext} from '../contexts/AuthContext';
import {HomeScreenNavigationProp} from '../models/navigation';
import firestore from '../../shims/firebase-firestore-web';

function Home() {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const user = useContext(UserContext);


  if (!user) {
    return null;
  }

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text>Helo World</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 20,
    marginBottom: 0,
    paddingHorizontal: 20,
    height: 50,
    fontSize: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  list: {
    padding: 20,
  },
  card: {
    marginVertical: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Home;
