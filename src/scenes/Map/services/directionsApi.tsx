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

  const walkingToStationBounds = walkingToStationRoutes[0]?.bounds;
  const walkingToDestinationBounds = walkingToDestinationRoutes[0]?.bounds;

  return {
    walkingToStation: walkingToStationRoutes[0],
    walkingToDestination: walkingToDestinationRoutes[0],
    cycling: cyclingRoutes.map((cyclingRoute, index) => {
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
        isSelected: index === 0,
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
        totalBounds: {
          northEast: {
            latitude: Math.max(
              walkingToStationBounds.northEast.latitude,
              walkingToDestinationBounds.northEast.latitude,
              cyclingRoute.bounds.northEast.latitude
            ),
            longitude: Math.max(
              walkingToStationBounds.northEast.longitude,
              walkingToDestinationBounds.northEast.longitude,
              cyclingRoute.bounds.northEast.longitude
            ),
          },
          southWest: {
            latitude: Math.min(
              walkingToStationBounds.southWest.latitude,
              walkingToDestinationBounds.southWest.latitude,
              cyclingRoute.bounds.southWest.latitude
            ),
            longitude: Math.min(
              walkingToStationBounds.southWest.longitude,
              walkingToDestinationBounds.southWest.longitude,
              cyclingRoute.bounds.southWest.longitude
            ),
          },
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

    // google.maps.LatLngBounds is a class provided by Google's client SDK,
    // but here we're working with the REST response directly.
    const routeBounds = bounds as unknown as {
      northeast: google.maps.LatLngLiteral;
      southwest: google.maps.LatLngLiteral;
    };

    return {
      polylineCoordinates,
      bounds: {
        northEast: {
          latitude: routeBounds.northeast.lat,
          longitude: routeBounds.northeast.lng,
        },
        southWest: {
          latitude: routeBounds.southwest.lat,
          longitude: routeBounds.southwest.lng,
        },
      },
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
