import { memo } from 'react';
import { Polyline } from 'react-native-maps';
import { Directions } from '../services/types';

type Props = {
  directions: Directions;
};

export default memo(function DirectionsPolyline({ directions }: Props) {
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
});
