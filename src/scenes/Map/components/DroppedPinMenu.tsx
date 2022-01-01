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
  container: {},
});
