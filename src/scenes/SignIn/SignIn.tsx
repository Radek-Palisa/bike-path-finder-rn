import { useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Dimensions } from 'react-native';
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonType,
  AppleAuthenticationButtonStyle,
} from 'expo-apple-authentication';
import useGoogleLogin from './services/googleLogin';
import * as WebBrowser from 'expo-web-browser';
import useAppleLogin from './services/appleLogin';
import GoogleLoginButton from './components/GoogleLoginButton';
import BikeStationIcon from '../../components/icons/BikeStationIcon';

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
    <View style={styles.container}>
      <BikeStationIcon width={74} height={100} fillPercentage={1} />
      <Text style={styles.welcomeText}>Welcome</Text>
      <View style={styles.buttonContainer}>
        <GoogleLoginButton
          isDisabled={isGoogleLoginDisabled}
          onPress={handleGoogleLogin}
        />
        {isAppleLoginAvailable && (
          <AppleAuthenticationButton
            buttonType={AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthenticationButtonStyle.BLACK}
            // buttonStyle={AppleAuthenticationButtonStyle.WHITE_OUTLINE}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    paddingTop: 16,
    fontSize: 18,
  },
  buttonContainer: {
    maxWidth: 360,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 70,
  },
});
