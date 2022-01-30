import { StyleSheet, Switch, Text, View } from 'react-native';
import BoltIcon from '../../../components/icons/BoltIcon';
import DirectionsButton from './DirectionsButton';

type Props = {
  onDirectionsPress: () => void;
  onSetEbikeDirections: (isEbikeDirections: boolean) => void;
  isEbikeDirections: boolean | null;
};

export default function DroppedPinMenu({
  onDirectionsPress,
  onSetEbikeDirections,
  isEbikeDirections,
}: Props) {
  return (
    <View style={styles.container}>
      <DirectionsButton onPress={onDirectionsPress} />
      <View style={styles.switchContainer}>
        <View style={styles.switchLine}>
          <BoltIcon width={28} fill="#101010" />
          <Switch
            style={styles.switch}
            value={isEbikeDirections || false}
            onValueChange={onSetEbikeDirections}
            accessibilityLabel="Use only electric bikes"
          />
        </View>
        <Text style={styles.switchLabel}>Must be e-bike.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchContainer: {
    alignItems: 'flex-end',
  },
  switch: {
    marginLeft: 6,
  },
  switchLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    paddingTop: 6,
    color: '#282828',
    fontSize: 11,
  },
});
