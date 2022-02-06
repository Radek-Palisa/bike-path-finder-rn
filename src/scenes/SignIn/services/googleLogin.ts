import { useCallback } from 'react';
import Constants from 'expo-constants';
import * as Google from 'expo-auth-session/providers/google';
import type { UserCredential } from 'firebase/auth';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

const configKeys = Constants.manifest!.extra!;

export default function useGoogleLogin(): [
  boolean,
  () => Promise<UserCredential>
] {
  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    clientId: configKeys.googleOauthWebClientId,
  });

  const isLoginDisabled = !request;

  const loginPrompt = useCallback(async () => {
    const response = await promptAsync();

    if (response?.type !== 'success') {
      throw new Error(response.type);
    }

    const credential = GoogleAuthProvider.credential(response.params.id_token);

    const auth = getAuth();

    return signInWithCredential(auth, credential);
  }, [promptAsync]);

  return [isLoginDisabled, loginPrompt];
}
