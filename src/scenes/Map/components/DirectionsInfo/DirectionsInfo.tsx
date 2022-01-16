import { View, StyleSheet } from 'react-native';
import type { DirectionState } from '../../services/types';
import RouteInfo from './components/RouteInfo';

type Props = {
  directionState: NonNullable<DirectionState>;
};

export default function DirectionsInfo({ directionState }: Props) {
  const { directions } = directionState;

  return (
    <View style={styles.container}>
      <RouteInfo directions={directions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
