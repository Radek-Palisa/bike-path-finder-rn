import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import type { LatLng } from 'react-native-maps';
import DroppedPinMenu from './components/DroppedPinMenu';
import BottomPanel from './components/BottomPanel';
import FindMyLocationButton from './components/FindMyLocationButton';
import getMyLocation from './services/getMyLocation';
import MyLocationMarker from './components/MyLocationMarker';
import StationMarkers from './components/StationMarkers';
import { StationsInfo, StationStatus } from './services/types';
import useGetBikeStationsInfo from './services/useGetBikeStationsInfo';
import { findAndUpdateNearStations } from './services/nearStations';

export default function MapScene() {
  const map = useRef<MapView | null>(null);
  const getBikeStationsInfo = useGetBikeStationsInfo();
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [myLocation, setMyLocation] = useState<LatLng | null>(null);
  const stationsNearOrigin = useRef<StationStatus[] | null>(null);
  const stationsNearDestinaion = useRef<StationStatus[] | null>(null);
  const [bikeStationsInfo, setBikeStationsInfo] = useState<StationsInfo | null>(
    null
  );
  const [directionParams, setDirectionParams] = useState<any | null>(null);

  useEffect(() => {
    const myLocation = getMyLocation().then(location => {
      setMyLocation(location);
      return location;
    });
    getBikeStationsInfo(myLocation)
      .then(({ stationsInfo, nearStations }) => {
        stationsNearOrigin.current = nearStations;
        setBikeStationsInfo(stationsInfo);
      })
      .catch(e => Alert.alert('Error', e.message));
  }, []);

  useEffect(() => {
    if (!destination) return;

    setBikeStationsInfo(bikeStationsInfo => {
      const { updatedStationsInfo, nearStations } = findAndUpdateNearStations(
        bikeStationsInfo,
        destination
      );
      stationsNearDestinaion.current = nearStations;
      return updatedStationsInfo;
    });
  }, [destination, setBikeStationsInfo]);

  const handleFindMyLocationPress = () => {
    if (!myLocation) return;
    map.current?.animateCamera({
      center: myLocation,
      zoom: 16,
    });
  };

  const handleDirectionsPress = () => {
    if (
      !myLocation ||
      !destination ||
      !stationsNearOrigin.current ||
      !stationsNearDestinaion.current
    ) {
      Alert.alert('Error', 'Missing direction parameters');
      return;
    }

    setDirectionParams({
      origin: myLocation,
      originStation: stationsNearOrigin.current[0],
      destination,
      destinationStation: stationsNearDestinaion.current[0],
    });

    alert('Directions');
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={map}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onLongPress={e => setDestination(e.nativeEvent.coordinate)}
        onPress={() => setDestination(null)}
      >
        {myLocation && <MyLocationMarker coordinate={myLocation} />}
        {destination && <Marker coordinate={destination} />}
        {bikeStationsInfo && <StationMarkers data={bikeStationsInfo} />}
      </MapView>
      <BottomPanel isActivated={Boolean(destination)}>
        <View style={styles.findMyLocationWrapper}>
          <FindMyLocationButton onPress={handleFindMyLocationPress} />
        </View>
        <DroppedPinMenu onDirectionsPress={handleDirectionsPress} />
      </BottomPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  findMyLocationWrapper: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingRight: 16,
  },
});
