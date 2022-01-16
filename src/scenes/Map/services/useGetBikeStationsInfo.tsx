import { useRef } from 'react';
import { fetchBicingStationsStatus, getBikeStationsInfo } from './bicingApi';
import { StationsInfo } from './types';

type GetBikeStationsInfo = () => Promise<StationsInfo>;

export default function useGetBikeStationsInfo(): GetBikeStationsInfo {
  const bikeStationsDataPromise = useRef(getBikeStationsInfo());

  return async () => {
    const [stationsInfo, stationStatus] = await Promise.all([
      bikeStationsDataPromise.current,
      fetchBicingStationsStatus(),
    ]);

    stationStatus.data.stations.forEach(stationData => {
      const station = stationsInfo.get(stationData.station_id);

      if (!station) return;

      station.availableElectric = stationData.num_bikes_available_types.ebike;
      station.availableMechanical =
        stationData.num_bikes_available_types.mechanical;
      station.availableDocks = stationData.num_docks_available;
    });

    return stationsInfo;
  };
}
