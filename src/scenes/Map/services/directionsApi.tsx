import Constants from 'expo-constants';
import { LatLng } from 'react-native-maps';
import PolylineDecoder from '@mapbox/polyline';
import type { Route } from './types';

const API_KEY = Constants.manifest?.extra?.googleApiKey;
const GOOGLE_DIRECTIONS_API_URL =
  'https://maps.googleapis.com/maps/api/directions/json';

type DirectionOptions = {
  alternatives?: boolean;
  mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
};

export default async function getDirections(
  origin: LatLng,
  destination: LatLng,
  { alternatives, mode }: DirectionOptions = {}
): Promise<Route[]> {
  const originParam = `origin=${origin.latitude},${origin.longitude}`;
  const destinationParam = `destination=${destination.latitude},${destination.longitude}`;
  const alternativesParam = alternatives ? '&alternatives=true' : '';
  const modeParam = mode ? `&mode=${mode}` : '';
  const apiKeyParam = `&key=${API_KEY}`;

  const rawResponse = await fetch(
    `${GOOGLE_DIRECTIONS_API_URL}?${originParam}&${destinationParam}${alternativesParam}${modeParam}${apiKeyParam}`
  );

  const result = (await rawResponse.json()) as google.maps.DirectionsResult & {
    status: google.maps.DirectionsStatus;
  };

  if (result.status !== 'OK') {
    throw new Error(result.status);
  }

  return mapGoogleDirectionsResult(result);
}

function mapGoogleDirectionsResult(
  result: google.maps.DirectionsResult
): Route[] {
  return result.routes.map(({ overview_polyline, bounds, legs }) => {
    const points = PolylineDecoder.decode(
      // @ts-expect-error - overview_polyline incorrectly typed
      overview_polyline.points
    );

    const polylineCoordinates = points.map(([latitude, longitude]) => ({
      latitude,
      longitude,
    }));

    return {
      polylineCoordinates,
      bounds,
      distance: legs[0].distance,
      duration: legs[0].duration,
    };
  });
}
