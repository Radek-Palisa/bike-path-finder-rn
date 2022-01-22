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
      {directions.cycling.map(({ polylineCoordinates, isSelected }, index) => (
        <Polyline
          key={index}
          coordinates={polylineCoordinates}
          strokeWidth={6}
          strokeColor={isSelected ? '#669df6' : '#bbbdbf'}
          zIndex={isSelected ? 1 : 0}
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
