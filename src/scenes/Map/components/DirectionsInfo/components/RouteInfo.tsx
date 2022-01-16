import { View, Text, StyleSheet } from 'react-native';
import DirectionsBikeIcon from '../../../../../components/icons/DirectionsBikeIcon';
import DirectionsWalkIcon from '../../../../../components/icons/DirectionsWalkIcon';
import type { Directions } from '../../../services/types';

type Props = {
  directions: Directions | null;
};

export default function RouteInfo({ directions }: Props) {
  if (!directions) {
    // TODO: loader
    return null;
  }

  return (
    <>
      <View style={styles.directionsInfo}>
        <Text style={styles.duration}>
          {directions.cycling[0].totalDuration.text}
        </Text>
        <Text style={styles.distance}>
          ({directions.cycling[0].totalDistance.text})
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
          {directions.cycling[0].duration?.text}
        </Text>
        <DirectionsWalkIcon width={20} />
        <Text style={styles.durationBreakdownText}>
          {directions.walkingToDestination.duration?.text}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  directionsInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 10,
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
    paddingLeft: 10,
  },
  durationBreakdownText: {
    color: 'gray',
    paddingLeft: 2,
  },
  durationBreakdownBikeIcon: {
    marginHorizontal: 4,
  },
});
