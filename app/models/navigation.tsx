import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

export type HomeStackParamList = {
  HomeScreen: undefined;
  AnalysisScreen: undefined;
  //add more here
};

export type IntroStackParamList = {
  IntroScreen: undefined;
  IntroAllocationScreen: undefined;
};

export type ProfileStackParamList = {
  UserProfile: undefined;
  UserSettings: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  User: NavigatorScreenParams<ProfileStackParamList>;
};

export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Home'>,
  StackNavigationProp<HomeStackParamList>
>;

export type IntroScreenProps = StackScreenProps<
  IntroStackParamList,
  'IntroScreen'
>;
export type IntroAllocationScreenProps = StackScreenProps<
  IntroStackParamList,
  'IntroAllocationScreen'
>;

export type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'User'>,
  StackNavigationProp<ProfileStackParamList>
>;
