import { Marker } from 'react-native-maps';
import type { LatLng } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

type Props = {
  coordinate: LatLng;
};

export default function MyLocationMarker({ coordinate }: Props) {
  return (
    <Marker coordinate={coordinate}>
      <View style={styles.container} />
    </Marker>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 22,
    height: 22,
    backgroundColor: '#4181EC',
    borderRadius: 22,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'white',
  },
});
