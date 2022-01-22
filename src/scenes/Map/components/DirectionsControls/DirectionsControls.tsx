import { View, StyleSheet } from 'react-native';
import type { Directions } from '../../services/types';
import CancelDirectionsButton from './components/CancelDirectionsButton';
import RouteOptionButton from './components/RouteOptionButton';

type Props = {
  onDirectionsClearPress: () => void;
  onRouteSelect: (routeIndex: number) => void;
  directions?: Directions | null;
};

export default function DirectionsControls({
  onDirectionsClearPress,
  onRouteSelect,
  directions,
}: Props) {
  return (
    <View>
      <CancelDirectionsButton onPress={onDirectionsClearPress} />
      <View style={styles.routesContainer}>
        {directions &&
          directions.cycling.map((route, i) => (
            <RouteOptionButton
              key={i}
              onPress={() => onRouteSelect(i)}
              text={route.totalDuration.text}
              isSelected={route.isSelected}
            />
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  routesContainer: {
    minHeight: 38,
    paddingBottom: 8,
    paddingLeft: 15,
    flexDirection: 'row',
  },
});
