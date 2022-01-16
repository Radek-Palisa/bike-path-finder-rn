import { LatLng } from 'react-native-maps';
import calculateDistance from './calculateDistance';
import { StationsInfo, StationStatus } from './types';

const NEAR_STATIONS_LIMIT = 3;

export type NearStation = {
  distance: number;
  station: StationStatus;
};

function mutateNearStations(
  nearStations: NearStation[],
  maybeNearStation: NearStation
): NearStation[] {
  nearStations.push(maybeNearStation);
  nearStations.sort((a, b) => a.distance - b.distance);
  nearStations.splice(NEAR_STATIONS_LIMIT);

  return nearStations;
}

type Options = {
  limitByAvailability?: 'docks' | 'bikesTotal';
};

export function findNearStations(
  stationsInfo: StationsInfo | null,
  location: LatLng,
  { limitByAvailability }: Options = {}
): StationStatus[] | null {
  if (!stationsInfo) {
    return null;
  }

  const nearStations: NearStation[] = [];

  stationsInfo.forEach(station => {
    const distance = calculateDistance(location, station.coordinate);

    let condition = true;

    if (limitByAvailability === 'docks') {
      condition = station.availableDocks > 0;
    } else if (limitByAvailability === 'bikesTotal') {
      condition =
        station.availableMechanical > 0 || station.availableElectric > 0;
    }

    if (condition) {
      mutateNearStations(nearStations, { distance, station });
    }
  });

  return nearStations.map(({ station }) => station);
}
