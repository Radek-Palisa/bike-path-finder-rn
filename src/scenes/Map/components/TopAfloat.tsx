import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
};

export default function TopAfloat({ children }: Props) {
  return (
    <SafeAreaView
      mode="margin"
      edges={['top', 'right', 'left']}
      style={styles.container}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    marginTop: 10,
    marginHorizontal: 16,
  },
});
