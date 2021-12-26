import { StyleSheet, View } from 'react-native';
import DirectionsButton from './DirectionsButton';

type Props = {
  onDirectionsPress: () => void;
};

export default function DroppedPinMenu({ onDirectionsPress }: Props) {
  return (
    <View style={styles.container}>
      <DirectionsButton onPress={onDirectionsPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
