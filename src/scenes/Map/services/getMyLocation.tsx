import * as Location from 'expo-location';

export default async function getMyLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access location was denied');
    return null;
  }

  const { coords } = await Location.getCurrentPositionAsync();

  return coords;
}
