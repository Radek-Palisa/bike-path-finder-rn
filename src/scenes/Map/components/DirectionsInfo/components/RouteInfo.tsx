import { View, Text, StyleSheet } from 'react-native';
import DirectionsBikeIcon from '../../../../../components/icons/DirectionsBikeIcon';
import DirectionsWalkIcon from '../../../../../components/icons/DirectionsWalkIcon';
import type { CyclingRoute, Directions } from '../../../services/types';

type Props = {
  directions: Directions | null;
};

export default function RouteInfo({ directions }: Props) {
  if (!directions) {
    // TODO: loader
    return null;
  }

  const selectedRoute = directions.cycling.find(
    route => route.isSelected
  ) as CyclingRoute;

  return (
    <View>
      <View style={styles.directionsInfo}>
        <Text style={styles.duration}>{selectedRoute.totalDuration.text}</Text>
        <Text style={styles.distance}>
          ({selectedRoute.totalDistance.text})
        </Text>
      </View>
      <View style={styles.durationBreakdown}>
        <DirectionsWalkIcon width={20} />
        <Text style={styles.durationBreakdownText}>
          {directions.walkingToStation.duration?.text}
        </Text>
        <DirectionsBikeIcon
          width={20}
          style={styles.durationBreakdownBikeIcon}
        />
        <Text style={styles.durationBreakdownText}>
          {selectedRoute.duration?.text}
        </Text>
        <DirectionsWalkIcon width={20} />
        <Text style={styles.durationBreakdownText}>
          {directions.walkingToDestination.duration?.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  directionsInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  duration: {
    fontSize: 20,
  },
  distance: {
    fontSize: 20,
    color: 'gray',
    paddingHorizontal: 10,
  },
  durationBreakdown: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  durationBreakdownText: {
    color: 'gray',
    paddingLeft: 2,
  },
  durationBreakdownBikeIcon: {
    marginHorizontal: 4,
  },
});
