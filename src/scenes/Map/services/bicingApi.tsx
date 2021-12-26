import AsyncStorage from '@react-native-async-storage/async-storage';
import sampleDataStationsInfo from '../../../../sample-data/stations-info.json';
import sampleDataStationsStatus from '../../../../sample-data/stations-status.json';
import {
  BicingApiStationsInfoResponse,
  GeoJsonFeatureCollection,
} from './types';

function asyncStorageGetStationsInfoLastFetch() {
  return AsyncStorage.getItem('stationsInfoLastFetch');
}

function asyncStorageSetStationsInfoLastFetch(
  dateString: string = new Date().toString()
) {
  return AsyncStorage.setItem('stationsInfoLastFetch', dateString);
}

function asyncStorageSetStationsInfo(
  stationsInfo: GeoJsonFeatureCollection
): Promise<void> {
  return AsyncStorage.setItem('stationsInfo', JSON.stringify(stationsInfo));
}

function asyncStorageGetStationsInfo(): Promise<GeoJsonFeatureCollection | null> {
  return AsyncStorage.getItem('stationsInfo').then(stationsInfo =>
    stationsInfo ? JSON.parse(stationsInfo) : null
  );
}

function isOlderThanDays(dateString: string, days: number) {
  const diff = new Date().getTime() - new Date(dateString).getTime();
  return diff > days * 24 * 60 * 60 * 1000;
}

function mapBicingStationsInfoToGeoJson(
  rawData: BicingApiStationsInfoResponse
): GeoJsonFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: rawData.data.stations.map(
      ({ station_id, capacity, lat, lon }) => ({
        id: station_id,
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        properties: {
          capacity,
          shouldShowStatus: false,
        },
      })
    ),
  };
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

export async function getBicingStationsGeoData(): Promise<GeoJsonFeatureCollection> {
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

  const mappedData = mapBicingStationsInfoToGeoJson(bicingStationsData);

  asyncStorageSetStationsInfo(mappedData).catch(e => alert(e.message));

  asyncStorageSetStationsInfoLastFetch().catch(e => alert(e.message));

  return mappedData;
}
