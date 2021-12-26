import { LatLng } from 'react-native-maps';

/**
 * returns distance in meters between two points.
 * copied from
 * https://github.com/react-native-maps/react-native-maps/issues/704#issuecomment-292167534
 */
export default function calculateDistance(
  coordinateA: LatLng,
  coordinateB: LatLng
) {
  // http://www.movable-type.co.uk/scripts/latlong.html
  const lat1 = coordinateA.latitude;
  const lon1 = coordinateA.longitude;

  const lat2 = coordinateB.latitude;
  const lon2 = coordinateB.longitude;

  const R = 6371e3; // earth radius in meters
  const φ1 = lat1 * (Math.PI / 180);
  const φ2 = lat2 * (Math.PI / 180);
  const Δφ = (lat2 - lat1) * (Math.PI / 180);
  const Δλ = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2));

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance; // in meters
}
