import { useEffect } from 'react';
import { Alert } from 'react-native';
import { LatLng } from 'react-native-maps';

export type DirectionParams = {
  origin: LatLng;
  originStation: LatLng;
  destination: LatLng;
  destinationStation: LatLng;
};

type Props = {
  directionParams: DirectionParams | null;
};

export default function DirectionsPolyline({ directionParams }: Props) {
  useEffect(() => {
    if (!directionParams) return;

    Alert.alert('DirectionParams', JSON.stringify(directionParams));
  }, [directionParams]);

  return null;
}
