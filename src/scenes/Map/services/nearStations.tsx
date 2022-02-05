import { LatLng } from 'react-native-maps';
import calculateDistance from './calculateDistance';
import { ExtendedStationStatus, StationsInfo, StationStatus } from './types';

const NEAR_STATIONS_LIMIT = 3;

export type NearStation = {
  distance: number;
  station: ExtendedStationStatus;
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
  limitByAvailability?: 'docks' | 'bikesTotal' | 'bikesElectric';
};

export function findNearStations(
  stationsInfo: StationsInfo | null,
  location: LatLng,
  { limitByAvailability }: Options = {}
): ExtendedStationStatus[] | null {
  if (!stationsInfo) {
    return null;
  }

  const nearStations: NearStation[] = [];

  stationsInfo.forEach((station, stationId) => {
    const distance = calculateDistance(location, station.coordinate);

    let condition = true;

    if (limitByAvailability === 'docks') {
      condition = station.availableDocks > 0;
    } else if (limitByAvailability === 'bikesTotal') {
      condition =
        station.availableMechanical > 0 || station.availableElectric > 0;
    } else if (limitByAvailability === 'bikesElectric') {
      condition = station.availableElectric > 0;
    }

    if (condition) {
      mutateNearStations(nearStations, {
        distance,
        station: { ...station, stationId },
      });
    }
  });

  return nearStations.map(({ station }) => station);
}

type CheckStationsAvailabilityOptions = {
  isEbikeDirections?: boolean;
};

export function areRouteStationsAvailable(
  {
    originStation,
    destinationStation,
  }: {
    originStation?: StationStatus;
    destinationStation?: StationStatus;
  },
  { isEbikeDirections }: CheckStationsAvailabilityOptions = {}
): boolean {
  const hasNoAvailableMechanical = originStation?.availableMechanical === 0;
  const hasNoAvailableElectric = originStation?.availableElectric === 0;
  const hasNoAvailableDocks = destinationStation?.availableDocks === 0;

  if (
    hasNoAvailableDocks ||
    (isEbikeDirections ? hasNoAvailableElectric : hasNoAvailableMechanical)
  ) {
    return true;
  }

  return false;
}
