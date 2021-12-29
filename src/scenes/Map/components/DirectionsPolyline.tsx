import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import type { LatLng } from 'react-native-maps';
import getDirections from '../services/directionsApi';
import { Polyline } from 'react-native-maps';
import { Route } from '../services/types';

type DirectionsState = {
  walkingToStation: Route;
  cycling: Route[];
  walkingToDestination: Route;
};

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
  const [directions, setDirections] = useState<DirectionsState | null>(null);

  useEffect(() => {
    if (!directionParams) {
      return setDirections(null);
    }

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
          setDirections({
            walkingToStation: walkingToStationRoutes[0],
            cycling: cyclingRoutes,
            walkingToDestination: walkingToDestinationRoutes[0],
          });
        }
      )
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  }, [directionParams, setDirections]);

  if (!directions) return null;

  return (
    <>
      <Polyline coordinates={directions.walkingToStation.polylineCoordinates} />
      {directions.cycling.map((route, index) => (
        <Polyline key={index} coordinates={route.polylineCoordinates} />
      ))}
      <Polyline
        coordinates={directions.walkingToDestination.polylineCoordinates}
      />
    </>
  );
}
