import { initializeApp } from 'firebase/app';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Map from './src/scenes/Map/Map';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppLoading from 'expo-app-loading';
import SignIn from './src/scenes/SignIn/SignIn';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const configKeys = Constants.manifest!.extra!;

const firebaseConfig = {
  apiKey: configKeys.firebaseApiKey,
  authDomain: configKeys.firebaseAuthDomain,
  projectId: configKeys.firebaseProjectId,
  storageBucket: configKeys.firebaseStorageBucket,
  messagingSenderId: configKeys.firebaseMessagingSenderId,
  appId: configKeys.firebaseAppId,
  measurementId: configKeys.firebaseMeasurementId,
};

initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState<null | boolean>(null);

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, user => {
      setIsSignedIn(Boolean(user));
    });
  }, []);

  if (isSignedIn === null) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {isSignedIn ? (
            <Stack.Screen
              options={{ headerShown: false }}
              name="Home"
              component={Map}
            />
          ) : (
            <Stack.Screen name="Sign In" component={SignIn} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
