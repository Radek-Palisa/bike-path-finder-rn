import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { GeoJsonFeatureCollection } from '../services/types';
import BikeStationIcon from '../../../components/icons/BikeStationIcon';
type Props = {
  data: GeoJsonFeatureCollection;
};

export default memo(function StationMarkers({ data }: Props) {
  return (
    <>
      {data.features.map(({ id, geometry, properties }) => (
        <Marker
          key={id}
          coordinate={{
            longitude: geometry.coordinates[0],
            latitude: geometry.coordinates[1],
          }}
        >
          {properties.shouldShowStatus ? (
            <BikeStationIcon fillPercentage={0.5} />
          ) : (
            <View style={styles.container} />
          )}
        </Marker>
      ))}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 22,
    height: 22,
    backgroundColor: 'red',
    borderRadius: 22,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: 'white',
  },
});
