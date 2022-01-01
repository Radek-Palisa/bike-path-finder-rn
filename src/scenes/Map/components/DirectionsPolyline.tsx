import { useEffect, useState } from 'react';
import type { LatLng } from 'react-native-maps';
import getDirections from '../services/directionsApi';
import { Polyline } from 'react-native-maps';
import { DirectionsState } from '../services/types';

export type DirectionParams = {
  origin: LatLng;
  originStation: LatLng;
  destination: LatLng;
  destinationStation: LatLng;
};

export type DirectionsOnChangeEvent =
  | {
      state: 'loading';
    }
  | {
      state: 'success';
      data: DirectionsState;
    }
  | {
      state: 'error';
      error: Error;
    };

type Props = {
  directionParams: DirectionParams | null;
  onChange?: (event: DirectionsOnChangeEvent) => void;
};

export default function DirectionsPolyline({
  directionParams,
  onChange,
}: Props) {
  const [directions, setDirections] = useState<DirectionsState | null>(null);

  useEffect(() => {
    if (!directionParams) {
      return setDirections(null);
    }

    onChange?.({ state: 'loading' });

    const { origin, originStation, destination, destinationStation } =
      directionParams;

    const walkingToOriginStation = getDirections(origin, originStation, {
      mode: 'walking',
    });

    const cycling = getDirections(originStation, destinationStation, {
      mode: 'bicycling',
      alternatives: true,
    });

    const walkingToDestination = getDirections(
      destinationStation,
      destination,
      {
        mode: 'walking',
      }
    );

    Promise.all([walkingToOriginStation, cycling, walkingToDestination])
      .then(
        ([
          walkingToStationRoutes,
          cyclingRoutes,
          walkingToDestinationRoutes,
        ]) => {
          const directionsState = {
            walkingToStation: walkingToStationRoutes[0],
            cycling: cyclingRoutes,
            walkingToDestination: walkingToDestinationRoutes[0],
          };

          setDirections(directionsState);
          onChange?.({ state: 'success', data: directionsState });
        }
      )
      .catch(error => onChange?.({ state: 'error', error }));
  }, [directionParams, setDirections]);

  if (!directions) return null;

  return (
    <>
      <Polyline
        coordinates={directions.walkingToStation.polylineCoordinates}
        strokeWidth={6}
        strokeColor="#669df6"
        lineDashPattern={[6, 6]}
      />
      {directions.cycling.map((route, index) => (
        <Polyline
          key={index}
          coordinates={route.polylineCoordinates}
          strokeWidth={6}
          strokeColor={index === 0 ? '#669df6' : '#bbbdbf'}
          zIndex={index === 0 ? 1 : 0}
        />
      ))}
      <Polyline
        coordinates={directions.walkingToDestination.polylineCoordinates}
        strokeWidth={6}
        strokeColor="#669df6"
        lineDashPattern={[6, 6]}
      />
    </>
  );
}
