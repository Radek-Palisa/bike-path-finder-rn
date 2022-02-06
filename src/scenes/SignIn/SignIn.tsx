import { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import useGoogleLogin from './services/googleLogin';
import * as WebBrowser from 'expo-web-browser';

export default function SignIn() {
  const [isGoogleLoginDisabled, googleLoginPrompt] = useGoogleLogin();

  // https://docs.expo.dev/guides/authentication/#warming-the-browser
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const handleGoogleLogin = () => {
    googleLoginPrompt()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        Alert.alert('Google Sign-in failed', err.message);
      });
  };

  return (
    <View>
      <Button
        disabled={isGoogleLoginDisabled}
        title="Google Login"
        onPress={handleGoogleLogin}
      />
    </View>
  );
}
