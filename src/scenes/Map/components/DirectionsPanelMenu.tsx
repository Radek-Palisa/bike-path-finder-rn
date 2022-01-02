import { View, Text } from 'react-native';
import { DirectionsState } from '../services/types';
import CancelDirectionsButton from './CancelDirectionsButton';

type Props = {
  onDirectionsClearPress: () => void;
  directionsData: DirectionsState | null;
};

export default function DirectionsPanelMenu({
  onDirectionsClearPress,
  directionsData,
}: Props) {
  return (
    <View>
      <CancelDirectionsButton onPress={onDirectionsClearPress} />
      {directionsData && (
        <Text>
          {directionsData.walkingToStation.duration?.text} -{' '}
          {directionsData.cycling[0].duration?.text} -{' '}
          {directionsData.walkingToDestination.duration?.text}
        </Text>
      )}
    </View>
  );
}
