import { View, Button, Text } from 'react-native';
import { DirectionsState } from '../services/types';

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
      <Button title="Cancel" onPress={onDirectionsClearPress} />
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
