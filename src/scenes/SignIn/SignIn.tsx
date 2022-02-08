import { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
} from 'expo-apple-authentication';
import useGoogleLogin from './services/googleLogin';
import * as WebBrowser from 'expo-web-browser';
import useAppleLogin from './services/appleLogin';

export default function SignIn() {
  const [isGoogleLoginDisabled, googleLoginPrompt] = useGoogleLogin();
  const [isAppleLoginAvailable, appleLoginPrompt] = useAppleLogin();

  // https://docs.expo.dev/guides/authentication/#warming-the-browser
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const handleGoogleLogin = () => {
    googleLoginPrompt().catch(err => {
      Alert.alert('Google Sign-in failed', err.message);
    });
  };

  const handleAppleLogin = async () => {
    await appleLoginPrompt().catch(err =>
      Alert.alert('Apple Sign-in failed', err.message)
    );
  };

  return (
    <View>
      <Button
        disabled={isGoogleLoginDisabled}
        title="Google Login"
        onPress={handleGoogleLogin}
      />
      {isAppleLoginAvailable && (
        <AppleAuthenticationButton
          buttonType={AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={{
            width: '100%',
            height: 48,
            marginTop: 16,
          }}
          onPress={handleAppleLogin}
        />
      )}
    </View>
  );
}
