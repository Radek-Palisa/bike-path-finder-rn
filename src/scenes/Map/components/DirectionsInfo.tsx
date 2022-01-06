import { View, Text, StyleSheet } from 'react-native';
import DirectionsBikeIcon from '../../../components/icons/DirectionsBikeIcon';
import DirectionsWalkIcon from '../../../components/icons/DirectionsWalkIcon';
import { Directions } from '../services/types';
import CancelDirectionsButton from './CancelDirectionsButton';

type Props = {
  onDirectionsClearPress: () => void;
  directionsData: Directions | null;
};

export default function DirectionsInfo({
  onDirectionsClearPress,
  directionsData,
}: Props) {
  return (
    <View>
      <CancelDirectionsButton onPress={onDirectionsClearPress} />
      {directionsData && (
        <>
          <View style={styles.directionsInfo}>
            <Text style={styles.duration}>
              {directionsData.cycling[0].totalDuration.text}
            </Text>
            <Text style={styles.distance}>
              ({directionsData.cycling[0].totalDistance.text})
            </Text>
          </View>
          <View style={styles.durationBreakdown}>
            <DirectionsWalkIcon width={20} />
            <Text style={styles.durationBreakdownText}>
              {directionsData.walkingToStation.duration?.text}
            </Text>
            <DirectionsBikeIcon
              width={20}
              style={styles.durationBreakdownBikeIcon}
            />
            <Text style={styles.durationBreakdownText}>
              {directionsData.cycling[0].duration?.text}
            </Text>
            <DirectionsWalkIcon width={20} />
            <Text style={styles.durationBreakdownText}>
              {directionsData.walkingToDestination.duration?.text}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  directionsInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
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
