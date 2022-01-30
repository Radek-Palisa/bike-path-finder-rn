import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  isActivated: boolean;
  children: React.ReactNode;
};

export default function TopSlideInPanel({ isActivated, children }: Props) {
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.container, isActivated ? { top: 0 } : { bottom: '101%' }]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fff',
    // box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
