import { memo, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import type { Bounds, StationsInfo, StationStatus } from '../services/types';
import BikeStationIcon from '../../../components/icons/BikeStationIcon';
import getStationAvailability from '../services/getStationAvailability/getStationAvailability';

export type StationMarkerProps = StationStatus & { stationId: number };

type Props = {
  data: StationsInfo;
  zoomedInBounds: Bounds | null;
  onStationPress: (station: StationMarkerProps) => void;
};

/**
 * Even with the on and off screen split, the offscreen markers
 * are still to many (~450) and it freezes the map momentarily
 * TODO: implement more efficient marker rendering:
 * by either more gradual rendering or using PNG's.
 */
export default function StationMarkers({
  data,
  zoomedInBounds,
  onStationPress,
}: Props) {
  const [areOnScreenMarkersMounted, setAreOnScreenMarkersMounted] =
    useState(false);
  const stations = useMemo(() => {
    if (!zoomedInBounds) {
      return { onScreen: [], offScreen: [] };
    }

    const onScreen: StationMarkerProps[] = [];
    const offScreen: StationMarkerProps[] = [];

    data.forEach((station, stationId) => {
      const { longitude, latitude } = station.coordinate;
      const { northEast, southWest } = zoomedInBounds;

      const isWithinBounds =
        longitude >= southWest.longitude &&
        longitude <= northEast.longitude &&
        latitude >= southWest.latitude &&
        latitude <= northEast.latitude;

      (isWithinBounds ? onScreen : offScreen).push({ stationId, ...station });
    });

    return { onScreen, offScreen };
  }, [data, zoomedInBounds]);

  if (!zoomedInBounds) {
    return <StationDotMarkers data={data} />;
  }

  return (
    <>
      <StationCapacityMarkers
        stations={stations.onScreen}
        toggleMounted={setAreOnScreenMarkersMounted}
        onStationPress={onStationPress}
      />
      {areOnScreenMarkersMounted && (
        <StationCapacityMarkers
          stations={stations.offScreen}
          onStationPress={onStationPress}
        />
      )}
    </>
  );
}

type StationCapacityMarkersProps = {
  stations: Array<StationMarkerProps>;
  toggleMounted?: (isMounted: boolean) => void;
  onStationPress: (station: StationMarkerProps) => void;
};

const StationCapacityMarkers = memo(function _StationCapacityMarkers({
  stations,
  toggleMounted,
  onStationPress,
}: StationCapacityMarkersProps) {
  useEffect(() => {
    if (toggleMounted) {
      toggleMounted(true);
      return () => toggleMounted(false);
    }
  }, []);

  return (
    <>
      {stations.map(station => {
        const {
          stationId,
          availableMechanical,
          availableElectric,
          coordinate,
          capacity,
          isSelected,
        } = station;

        const availableTotal = availableMechanical + availableElectric;

        return (
          <Marker
            key={`${stationId}-1${isSelected ? '-selected' : ''}`}
            coordinate={coordinate}
            tracksViewChanges={false}
            stopPropagation
            onPress={isSelected ? undefined : () => onStationPress(station)}
          >
            <BikeStationIcon
              width={isSelected ? 40 : 34}
              height={isSelected ? 54 : 46}
              fillPercentage={getStationAvailability(availableTotal, capacity)}
            />
          </Marker>
        );
      })}
    </>
  );
});

const StationDotMarkers = memo(function _StationDotMarkers({
  data,
}: {
  data: StationsInfo;
}) {
  return (
    <>
      {[...data].map(([stationId, { coordinate }]) => {
        return (
          <Marker
            key={`${stationId}-0`}
            coordinate={coordinate}
            tracksViewChanges={false}
          >
            <View style={styles.stationDotMarker} />
          </Marker>
        );
      })}
    </>
  );
});

const styles = StyleSheet.create({
  stationDotMarker: {
    width: 10,
    height: 10,
    backgroundColor: '#DB504A',
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'white',
  },
});
