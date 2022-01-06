import { useEffect, useState } from 'react';
import getDirections from '../services/directionsApi';
import { Polyline } from 'react-native-maps';
import { DirectionParams, Directions } from '../services/types';

export type DirectionsOnChangeEvent =
  | {
      state: 'loading';
    }
  | {
      state: 'success';
      data: Directions;
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
  const [directions, setDirections] = useState<Directions | null>(null);

  useEffect(() => {
    if (!directionParams) {
      return setDirections(null);
    }

    onChange?.({ state: 'loading' });

    getDirections(directionParams)
      .then(directions => {
        setDirections(directions);
        onChange?.({ state: 'success', data: directions });
      })
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
