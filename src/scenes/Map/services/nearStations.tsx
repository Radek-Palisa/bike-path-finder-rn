import { LatLng } from 'react-native-maps';
import calculateDistance from './calculateDistance';
import { StationsInfo, StationStatus } from './types';

const NEAR_STATIONS_LIMIT = 3;

export type NearStation = {
  distance: number;
  station: StationStatus;
};

export function mutateNearStations(
  nearStations: NearStation[],
  maybeNearStation: NearStation
): NearStation[] {
  nearStations.push(maybeNearStation);
  nearStations.sort((a, b) => a.distance - b.distance);
  nearStations.splice(NEAR_STATIONS_LIMIT);

  return nearStations;
}

type FindNearStationsResult = {
  updatedStationsInfo: StationsInfo | null;
  nearStations: StationStatus[] | null;
};

export function findAndUpdateNearDestinationStations(
  stationsInfo: StationsInfo | null,
  location: LatLng
): FindNearStationsResult {
  if (!stationsInfo) {
    return {
      updatedStationsInfo: null,
      nearStations: null,
    };
  }

  const nearStations: NearStation[] = [];

  const updatedStationsInfo: [number, StationStatus][] = [...stationsInfo].map(
    ([stationdId, station]) => {
      const distance = calculateDistance(location, station.coordinate);

      const hasAvailableDocks = station.availableDocks > 0;

      if (hasAvailableDocks) {
        mutateNearStations(nearStations, { distance, station });
      }

      return [stationdId, station];
    }
  );

  return {
    updatedStationsInfo: new Map(updatedStationsInfo),
    nearStations: nearStations.map(({ station }) => station),
  };
}
