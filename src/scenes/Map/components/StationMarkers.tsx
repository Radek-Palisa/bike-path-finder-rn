import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { StationsInfo } from '../services/types';
import BikeStationIcon from '../../../components/icons/BikeStationIcon';

type Props = {
  data: StationsInfo;
};

export default memo(function StationMarkers({ data }: Props) {
  return (
    <>
      {[...data].map(([stationId, { coordinate, shouldShowStatus }]) => (
        <Marker key={stationId} coordinate={coordinate}>
          {shouldShowStatus ? (
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
