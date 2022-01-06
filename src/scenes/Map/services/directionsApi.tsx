import Constants from 'expo-constants';
import { LatLng } from 'react-native-maps';
import PolylineDecoder from '@mapbox/polyline';
import type { Directions, DirectionParams, Route } from './types';

const API_KEY = Constants.manifest?.extra?.googleApiKey;
const GOOGLE_DIRECTIONS_API_URL =
  'https://maps.googleapis.com/maps/api/directions/json';

type DirectionOptions = {
  alternatives?: boolean;
  mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
};

export default async function getDirections({
  origin,
  originStation,
  destination,
  destinationStation,
}: DirectionParams): Promise<Directions> {
  const walkingToOriginStation = fetchGoogleDirections(origin, originStation, {
    mode: 'walking',
  });

  const cycling = fetchGoogleDirections(originStation, destinationStation, {
    mode: 'bicycling',
    alternatives: true,
  });

  const walkingToDestination = fetchGoogleDirections(
    destinationStation,
    destination,
    {
      mode: 'walking',
    }
  );

  const [walkingToStationRoutes, cyclingRoutes, walkingToDestinationRoutes] =
    await Promise.all([walkingToOriginStation, cycling, walkingToDestination]);

  const walkingToStationDistanceValue =
    walkingToStationRoutes[0]?.distance?.value ?? 0;
  const walkingToStationDurationValue =
    walkingToStationRoutes[0]?.duration?.value ?? 0;
  const walkingToDestinationDistanceValue =
    walkingToDestinationRoutes[0]?.distance?.value ?? 0;
  const walkingToDestinationDurationValue =
    walkingToDestinationRoutes[0]?.duration?.value ?? 0;

  return {
    walkingToStation: walkingToStationRoutes[0],
    walkingToDestination: walkingToDestinationRoutes[0],
    cycling: cyclingRoutes.map(cyclingRoute => {
      const cyclingDistanceValue = cyclingRoute.distance?.value ?? 0;
      const cyclingDurationValue = cyclingRoute.duration?.value ?? 0;

      const totalDistanceValue =
        walkingToStationDistanceValue +
        walkingToDestinationDistanceValue +
        cyclingDistanceValue;

      const totalDurationValue =
        walkingToStationDurationValue +
        walkingToDestinationDurationValue +
        cyclingDurationValue;

      return {
        ...cyclingRoute,
        totalDistance: {
          text: mapDistanceValueToText(totalDistanceValue),
          value: totalDistanceValue,
        },
        totalDuration: {
          text: mapDurationValueToText(totalDurationValue),
          value:
            walkingToStationDurationValue +
            walkingToDestinationDurationValue +
            cyclingDurationValue,
        },
      };
    }),
  };
}

export async function fetchGoogleDirections(
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

const HOUR_IN_SECONDS = 60 * 60;

function mapDurationValueToText(durationValueInSeconds: number): string {
  if (durationValueInSeconds < HOUR_IN_SECONDS) {
    return `${Math.max(Math.round(durationValueInSeconds / 60), 1)} min`;
  }

  const hours = Math.floor(durationValueInSeconds / HOUR_IN_SECONDS);

  const remainder = mapDurationValueToText(
    durationValueInSeconds % HOUR_IN_SECONDS
  );

  return `${hours} hr ${remainder}`;
}

function mapDistanceValueToText(distanceValueInMeters: number): string {
  if (distanceValueInMeters < 1000) {
    return `${distanceValueInMeters} m`;
  }

  const roundedToTwoDecimals = parseFloat(
    (distanceValueInMeters / 1000).toFixed(2)
  );
  const roundedToOneDecimal = Math.round(roundedToTwoDecimals * 10) / 10;

  return `${roundedToOneDecimal} km`;
}
