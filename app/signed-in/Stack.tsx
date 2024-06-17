import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useAppSettings} from '../components/AppSettings';
import {NotFound} from '../components/NotFound';
import Profile from './Profile';
import Settings from './Settings';
import Home from './Home';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeStackParamList, ProfileStackParamList } from '../models/navigation';

const TopStack = createStackNavigator<HomeStackParamList>();
const BottomStack = createStackNavigator<ProfileStackParamList>();
const BottomTab = createBottomTabNavigator();

const HomeStack: React.FC = () => {
  return (
    <TopStack.Navigator initialRouteName="HomeScreen">
      <TopStack.Screen name="HomeScreen" component={Home} options={{headerShown: false}} />
    </TopStack.Navigator>
  );
};

const ProfileStack: React.FC = () => {
  const appSettings = useAppSettings();
  return (
    <BottomStack.Navigator initialRouteName="UserProfile">
      <BottomStack.Screen name="UserProfile" component={Profile} options={{headerShown: false}} />
      <BottomStack.Screen name="UserSettings" component={Settings} options={{title: appSettings.t('settings')}} />
      <BottomStack.Screen name="NotFound" component={NotFound} options={{title: appSettings.t('NotFound')}} />
    </BottomStack.Navigator>
  );
};

const SignedIn = () => {
  const appSettings = useAppSettings();
  const insets = useSafeAreaInsets();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      safeAreaInsets={insets}
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'User') {
            iconName = 'account';
          }
          return <Icon name={iconName ?? ''} size={size} color={color} />;
        },
        tabBarStyle: {paddingBottom: 3},
        headerShown: false,
      })}>
      <BottomTab.Screen
  name="Home"
  component={HomeStack}
/>
<BottomTab.Screen
  name="User"
  component={ProfileStack}
  listeners={({ navigation }) => ({
    tabPress: e => {
      e.preventDefault(); 
      navigation.reset({
        index: 0,
        routes: [{ name: 'User' }], 
      });
    },
  })}
/>

    </BottomTab.Navigator>
  );
};

export default SignedIn;
