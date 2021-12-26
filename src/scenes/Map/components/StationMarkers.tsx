import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { StationsInfo } from '../services/types';
import BikeStationIcon from '../../../components/icons/BikeStationIcon';
import getStationAvailability from '../services/getStationAvailability/getStationAvailability';

type Props = {
  data: StationsInfo;
};

export default memo(function StationMarkers({ data }: Props) {
  return (
    <>
      {[...data].map(
        ([
          stationId,
          {
            coordinate,
            shouldShowStatus,
            capacity,
            availableMechanical,
            availableElectric,
          },
        ]) => {
          const availableTotal = availableMechanical + availableElectric;

          return (
            <Marker key={stationId} coordinate={coordinate}>
              {shouldShowStatus ? (
                <BikeStationIcon
                  fillPercentage={getStationAvailability(
                    availableTotal,
                    capacity
                  )}
                />
              ) : (
                <View style={styles.container} />
              )}
            </Marker>
          );
        }
      )}
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
