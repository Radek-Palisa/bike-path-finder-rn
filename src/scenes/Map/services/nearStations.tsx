import { StationStatus } from './types';

export const NEAR_STATION_DISTANCE_METERS = 500;
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
