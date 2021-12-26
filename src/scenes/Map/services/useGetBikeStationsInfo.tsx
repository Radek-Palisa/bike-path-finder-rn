import { useRef } from 'react';
import { LatLng } from 'react-native-maps';
import { fetchBicingStationsStatus, getBikeStationsInfo } from './bicingApi';
import { isWithinDistance } from './calculateDistance';
import { StationsInfo } from './types';

type GetBikeStationsInfo = (
  startLocation: Promise<LatLng | null>
) => Promise<{ stationsInfo: StationsInfo }>;

export default function useGetBikeStationsInfo(): GetBikeStationsInfo {
  const bikeStationsDataPromise = useRef(getBikeStationsInfo());

  return async startLocation => {
    const [resolvedStartLocation, stationsInfo, stationStatus] =
      await Promise.all([
        startLocation,
        bikeStationsDataPromise.current,
        fetchBicingStationsStatus(),
      ]);

    stationStatus.data.stations.forEach(stationData => {
      const station = stationsInfo.get(stationData.station_id);

      if (!station) return;

      if (
        resolvedStartLocation &&
        isWithinDistance(500, resolvedStartLocation, station.coordinate)
      ) {
        station.shouldShowStatus = true;
      }

      station.availableElectric = stationData.num_bikes_available_types.ebike;
      station.availableMechanical =
        stationData.num_bikes_available_types.mechanical;
      station.availableDocks = stationData.num_docks_available;
    });

    return { stationsInfo };
  };
}
