import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NavigatorScreenParams} from '@react-navigation/native';

export type HomeStackParamList = {
  HomeScreen: undefined;
  //add more here
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

export type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'User'>,
  StackNavigationProp<ProfileStackParamList>
>;
