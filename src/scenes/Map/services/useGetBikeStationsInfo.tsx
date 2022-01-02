import { useRef } from 'react';
import { LatLng } from 'react-native-maps';
import { fetchBicingStationsStatus, getBikeStationsInfo } from './bicingApi';
import calculateDistance from './calculateDistance';
import {
  mutateNearStations,
  NEAR_STATION_DISTANCE_METERS,
} from './nearStations';
import type { NearStation } from './nearStations';
import { StationsInfo, StationStatus } from './types';

type GetBikeStationsInfo = (
  startLocation: Promise<LatLng | null>
) => Promise<{ stationsInfo: StationsInfo; nearStations: StationStatus[] }>;

export default function useGetBikeStationsInfo(): GetBikeStationsInfo {
  const bikeStationsDataPromise = useRef(getBikeStationsInfo());

  return async startLocation => {
    const [resolvedStartLocation, stationsInfo, stationStatus] =
      await Promise.all([
        startLocation,
        bikeStationsDataPromise.current,
        fetchBicingStationsStatus(),
      ]);

    const nearStations: NearStation[] = [];

    stationStatus.data.stations.forEach(stationData => {
      const station = stationsInfo.get(stationData.station_id);

      if (!station) return;

      station.availableElectric = stationData.num_bikes_available_types.ebike;
      station.availableMechanical =
        stationData.num_bikes_available_types.mechanical;
      station.availableDocks = stationData.num_docks_available;

      if (resolvedStartLocation) {
        const distance = calculateDistance(
          resolvedStartLocation,
          station.coordinate
        );

        const hasAvailableBikes =
          station.availableMechanical > 0 || station.availableElectric > 0;

        if (hasAvailableBikes) {
          mutateNearStations(nearStations, { distance, station });
        }

        if (distance <= NEAR_STATION_DISTANCE_METERS) {
          station.shouldShowStatus = true;
        }
      }
    });

    return {
      stationsInfo,
      nearStations: nearStations.map(({ station }) => station),
    };
  };
}
