import { LatLng } from 'react-native-maps';

export type DirectionParams = {
  origin: LatLng;
  originStation: LatLng;
  destination: LatLng;
  destinationStation: LatLng;
};

export type Directions = {
  walkingToStation: Route;
  walkingToDestination: Route;
  cycling: CyclingRoute[];
};

export type Bounds = {
  northEast: LatLng;
  southWest: LatLng;
};

export type Route = {
  polylineCoordinates: LatLng[];
  bounds: Bounds;
  distance: google.maps.Distance | undefined;
  duration: google.maps.Duration | undefined;
};

/** For convenience, includes extra fields counting in the walking data */
export type CyclingRoute = Route & {
  totalDistance: google.maps.Distance;
  totalDuration: google.maps.Duration;
  totalBounds: Bounds;
  isSelected: boolean;
};

export type StationStatus = {
  coordinate: LatLng;
  capacity: number;
  availableMechanical: number;
  availableElectric: number;
  availableDocks: number;
  isSelected: boolean;
};

export type ExtendedStationStatus = StationStatus & { stationId: number };

export type DirectionState =
  | {
      originStation: ExtendedStationStatus;
      destinationStation: ExtendedStationStatus;
      params: DirectionParams;
      state: 'loading';
      directions: null;
    }
  | {
      originStation: ExtendedStationStatus;
      destinationStation: ExtendedStationStatus;
      params: DirectionParams;
      state: 'success';
      directions: Directions;
    }
  | null;

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
