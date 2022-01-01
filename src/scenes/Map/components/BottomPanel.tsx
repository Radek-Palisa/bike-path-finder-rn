import { View, StyleSheet } from 'react-native';

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
    <View style={[styles.container, { bottom: isActivated ? 0 : -88 }]}>
      <View style={styles.afloatContent}>{afloatContent}</View>
      <View style={styles.panelContent}>{panelContent}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
  },
  afloatContent: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingRight: 16,
  },
  panelContent: {
    width: '100%',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#fff',
    // box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
