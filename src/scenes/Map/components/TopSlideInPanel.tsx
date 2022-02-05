import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  isActivated: boolean;
  panelContent: ReactNode;
  afloatContent: ReactNode;
};

export default function TopSlideInPanel({
  isActivated,
  afloatContent,
  panelContent,
}: Props) {
  return (
    <View
      style={[styles.container, isActivated ? { top: 0 } : { bottom: '101%' }]}
    >
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={styles.panelContent}
      >
        {panelContent}
      </SafeAreaView>
      <SafeAreaView
        mode="margin"
        edges={isActivated ? ['right'] : ['top', 'right']}
        style={[
          styles.afloatContent,
          isActivated && styles.afloatContentMargin,
        ]}
      >
        {afloatContent}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
  },
  panelContent: {
    backgroundColor: '#fff',
    // box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  afloatContent: {
    position: 'absolute',
    right: 0,
    top: '100%',
    // TopAfloat marginTop + SearchBar height + this marginTop
    marginTop: 10 + 50 + 30,
    marginRight: 16,
  },
  afloatContentMargin: {
    marginTop: 20,
  },
});
