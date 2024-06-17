import {StyleSheet, ViewStyle} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SocialType = 'google' | 'apple' | 'phone';

interface Props {
  style?: ViewStyle;
  type: SocialType;
  onPress: () => void;
  loading?: boolean;
  children: string;
}

function getSocialColor(type: SocialType): string {
  switch (type) {
    case 'google':
      return '#F96458';
    case 'apple':
      return '#000000';
    case 'phone':
      return '#b24292';
  }
}

function ProviderButton({
  style,
  type,
  onPress,
  loading,
  children,
}: Props): JSX.Element {
  return (
    <Button
      style={[styles.button, style]}
      icon={() => <Icon name="google" color="#fff" size={17} />}
      mode="contained"
      buttonColor={getSocialColor(type)}
      dark
      loading={loading}
      onPress={() => (loading ? null : onPress())}>
      {children}
    </Button>
  );
}

export default ProviderButton;

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
    width: 300,
  },
});
