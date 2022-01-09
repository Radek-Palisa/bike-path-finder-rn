import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  isActivated: boolean;
  afloatContent: React.ReactNode;
  panelContent: React.ReactNode;
};

export default function BottomPanel({
  isActivated,
  afloatContent,
  panelContent,
}: Props) {
  return (
    <View
      style={[styles.container, isActivated ? { bottom: 0 } : { top: '100%' }]}
    >
      <SafeAreaView
        mode="margin"
        edges={['bottom', 'right']}
        style={styles.afloatContent}
      >
        {afloatContent}
      </SafeAreaView>
      <SafeAreaView
        edges={['bottom', 'left', 'right']}
        style={styles.panelContent}
      >
        {panelContent}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
  },
  afloatContent: {
    position: 'absolute',
    right: 0,
    bottom: '100%',
    marginBottom: 20,
    marginRight: 16,
  },
  panelContent: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    // box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
