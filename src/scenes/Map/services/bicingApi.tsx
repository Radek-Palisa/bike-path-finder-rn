import AsyncStorage from '@react-native-async-storage/async-storage';
// import sampleDataStationsInfo from '../../../../sample-data/stations-info.json';
import sampleDataStationsStatus from '../../../../sample-data/stations-status.json';
import { BicingApiStationsInfoResponse, StationsInfo } from './types';

function asyncStorageGetStationsInfoLastFetch() {
  return AsyncStorage.getItem('stationsInfoLastFetch');
}

function asyncStorageSetStationsInfoLastFetch(
  dateString: string = new Date().toString()
) {
  return AsyncStorage.setItem('stationsInfoLastFetch', dateString);
}

function asyncStorageSetStationsInfo(
  stationsInfo: StationsInfo
): Promise<void> {
  const serialized = JSON.stringify(Array.from(stationsInfo.entries()));
  return AsyncStorage.setItem('stationsInfo', serialized);
}

function asyncStorageGetStationsInfo(): Promise<StationsInfo | null> {
  return AsyncStorage.getItem('stationsInfo').then(stationsInfoRaw => {
    return stationsInfoRaw ? new Map(JSON.parse(stationsInfoRaw)) : null;
  });
}

function isOlderThanDays(dateString: string, days: number) {
  const diff = new Date().getTime() - new Date(dateString).getTime();
  return diff > days * 24 * 60 * 60 * 1000;
}

function mapBicingStationsInfo(
  rawData: BicingApiStationsInfoResponse
): StationsInfo {
  return new Map(
    rawData.data.stations.map(({ station_id, capacity, lat, lon }) => [
      station_id,
      {
        coordinate: {
          longitude: lon,
          latitude: lat,
        },
        capacity,
        shouldShowStatus: false,
        availableMechanical: 0,
        availableElectric: 0,
        availableDocks: 0,
      },
    ])
  );
}

function fetchBicingStationsInfo(): Promise<BicingApiStationsInfoResponse> {
  return fetch(
    'https://api.bsmsa.eu/ext/api/bsm/gbfs/v2/en/station_information'
  ).then(response => response.json());
  // return Promise.resolve(
  //   sampleDataStationsInfo as BicingApiStationsInfoResponse
  // );
}

export function fetchBicingStationsStatus() {
  // return fetch('https://api.bsmsa.eu/ext/api/bsm/gbfs/v2/en/station_status').then(response =>
  //   response.json()
  // );
  return Promise.resolve(sampleDataStationsStatus);
}

export async function getBikeStationsInfo(): Promise<StationsInfo> {
  const stationsInfoLastFetch =
    await asyncStorageGetStationsInfoLastFetch().catch(e => alert(e.message));

  const currentStationsInfoPromise = asyncStorageGetStationsInfo().catch(e =>
    alert(e.message)
  );

  const shouldFetchFreshData = stationsInfoLastFetch
    ? isOlderThanDays(stationsInfoLastFetch, 7)
    : true;

  if (!shouldFetchFreshData) {
    const currentStationsInfo = await currentStationsInfoPromise;

    if (currentStationsInfo) {
      return currentStationsInfo;
    }
  }

  const bicingStationsData = await fetchBicingStationsInfo();

  const mappedData = mapBicingStationsInfo(bicingStationsData);

  asyncStorageSetStationsInfo(mappedData).catch(e => alert(e.message));

  asyncStorageSetStationsInfoLastFetch().catch(e => alert(e.message));

  return mappedData;
}
