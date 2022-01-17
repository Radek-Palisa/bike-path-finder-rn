import { View, StyleSheet } from 'react-native';
import type { DirectionState } from '../../services/types';
import RouteInfo from './components/RouteInfo';
import StationAvailabilityInfo from './components/StationAvailabilityInfo';

type Props = {
  directionState: NonNullable<DirectionState>;
};

export default function DirectionsInfo({ directionState }: Props) {
  const { directions, originStation, destinationStation } = directionState;

  return (
    <View style={styles.container}>
      <RouteInfo directions={directions} />
      <StationAvailabilityInfo
        originStation={originStation}
        destinationStation={destinationStation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
