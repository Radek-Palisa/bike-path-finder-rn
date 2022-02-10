import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import GoogleLogo from '../../../components/logos/GoogleLogo';

type Props = {
  onPress: () => void;
  isDisabled?: boolean;
};

export default function GoogleLoginButton({
  onPress,
  isDisabled = false,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      disabled={isDisabled}
      onPress={onPress}
    >
      <GoogleLogo />
      <Text style={styles.text}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    borderWidth: 1,
    borderRadius: 5,
  },
  text: {
    paddingLeft: 32,
    fontSize: 18,
  },
});
