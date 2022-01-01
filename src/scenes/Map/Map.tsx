import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import type { LatLng } from 'react-native-maps';
import DroppedPinMenu from './components/DroppedPinMenu';
import DirectionsPanelMenu from './components/DirectionsPanelMenu';
import BottomPanel from './components/BottomPanel';
import FindMyLocationButton from './components/FindMyLocationButton';
import getMyLocation from './services/getMyLocation';
import MyLocationMarker from './components/MyLocationMarker';
import StationMarkers from './components/StationMarkers';
import { DirectionsState, StationsInfo, StationStatus } from './services/types';
import useGetBikeStationsInfo from './services/useGetBikeStationsInfo';
import { findAndUpdateNearStations } from './services/nearStations';
import DirectionsPolyline, {
  DirectionsOnChangeEvent,
} from './components/DirectionsPolyline';
import type { DirectionParams } from './components/DirectionsPolyline';

export default function MapScene() {
  const map = useRef<MapView | null>(null);
  const getBikeStationsInfo = useGetBikeStationsInfo();
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [myLocation, setMyLocation] = useState<LatLng | null>(null);
  const [directions, setDirections] = useState<DirectionsState | null>(null);
  const stationsNearOrigin = useRef<StationStatus[] | null>(null);
  const stationsNearDestinaion = useRef<StationStatus[] | null>(null);
  const [bikeStationsInfo, setBikeStationsInfo] = useState<StationsInfo | null>(
    null
  );
  const [directionParams, setDirectionParams] =
    useState<DirectionParams | null>(null);

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

  const handleMapPress = useCallback(() => {
    if (directionParams) return;
    setDestination(null);
  }, [directionParams, setDestination]);

  const handleMapLongPress = useCallback(
    e => {
      if (directionParams) return;
      setDestination(e.nativeEvent.coordinate);
    },
    [directionParams, setDestination]
  );

  const handleFindMyLocationPress = () => {
    if (!myLocation) return;
    map.current?.animateCamera({
      center: myLocation,
      zoom: 16,
    });
  };

  const handleDirectionsChange = useCallback(
    (event: DirectionsOnChangeEvent) => {
      if (event.state === 'loading') return;

      if (event.state === 'error') {
        return Alert.alert('Error', event.error.message);
      }

      setDirections(event.data);
    },
    [setDirections]
  );

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
      originStation: stationsNearOrigin.current[0].coordinate,
      destination,
      destinationStation: stationsNearDestinaion.current[0].coordinate,
    });
  };

  const handleDirectionsClear = () => {
    setDirectionParams(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={map}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onLongPress={handleMapLongPress}
        onPress={handleMapPress}
      >
        {myLocation && <MyLocationMarker coordinate={myLocation} />}
        {destination && <Marker coordinate={destination} />}
        {bikeStationsInfo && <StationMarkers data={bikeStationsInfo} />}
        <DirectionsPolyline
          directionParams={directionParams}
          onChange={handleDirectionsChange}
        />
      </MapView>
      <BottomPanel
        isActivated={Boolean(destination)}
        afloatContent={
          <FindMyLocationButton onPress={handleFindMyLocationPress} />
        }
        panelContent={
          directionParams ? (
            <DirectionsPanelMenu
              onDirectionsClearPress={handleDirectionsClear}
              directionsData={directions}
            />
          ) : (
            <DroppedPinMenu onDirectionsPress={handleDirectionsPress} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
