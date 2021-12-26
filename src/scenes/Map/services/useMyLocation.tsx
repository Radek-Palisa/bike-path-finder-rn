import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function useMyLocation() {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});

      setLocation(coords);
    })();
  }, []);

  return location;
}
