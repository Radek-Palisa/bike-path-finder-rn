import { LatLng } from 'react-native-maps';

export type StationStatus = {
  coordinate: LatLng;
  capacity: number;
  shouldShowStatus: boolean;
  availableMechanical: number;
  availableElectric: number;
  availableDocks: number;
};

export type StationsInfo = Map<number, StationStatus>;

export type BicingApiStationsInfoResponse = {
  last_updated: number;
  ttl: number;
  data: {
    stations: Array<{
      station_id: number;
      name: string;
      physical_configuration: string;
      lat: number;
      lon: number;
      altitude: number;
      address: string;
      post_code: string;
      capacity: number;
      nearby_distance: number;
    }>;
  };
};