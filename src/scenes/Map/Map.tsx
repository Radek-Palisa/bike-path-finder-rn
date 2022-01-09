import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import type { LatLng } from 'react-native-maps';
import DroppedPinMenu from './components/DroppedPinMenu';
import DirectionsInfo from './components/DirectionsInfo';
import BottomPanel from './components/BottomPanel';
import FindMyLocationButton from './components/FindMyLocationButton';
import getMyLocation from './services/getMyLocation';
import MyLocationMarker from './components/MyLocationMarker';
import StationMarkers from './components/StationMarkers';
import type {
  DirectionParams,
  Directions,
  StationsInfo,
  StationStatus,
} from './services/types';
import useGetBikeStationsInfo from './services/useGetBikeStationsInfo';
import { findAndUpdateNearDestinationStations } from './services/nearStations';
import DirectionsPolyline from './components/DirectionsPolyline';
import TopPanel from './components/TopPanel';
import DirectionsControls from './components/DirectionsControls';
import getDirections from './services/directionsApi';

type DirectionState =
  | {
      params: DirectionParams;
      state: 'loading';
      directions: null;
    }
  | {
      params: DirectionParams;
      state: 'success';
      directions: Directions;
    }
  | null;

export default function MapScene() {
  const map = useRef<MapView | null>(null);
  const getBikeStationsInfo = useGetBikeStationsInfo();
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [myLocation, setMyLocation] = useState<LatLng | null>(null);
  const [directionState, setDirectionState] = useState<DirectionState>(null);
  const stationsNearOrigin = useRef<StationStatus[] | null>(null);
  const stationsNearDestinaion = useRef<StationStatus[] | null>(null);
  const [bikeStationsInfo, setBikeStationsInfo] = useState<StationsInfo | null>(
    null
  );

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
      const { updatedStationsInfo, nearStations } =
        findAndUpdateNearDestinationStations(bikeStationsInfo, destination);
      stationsNearDestinaion.current = nearStations;
      return updatedStationsInfo;
    });
  }, [destination, setBikeStationsInfo]);

  const handleMapPress = useCallback(() => {
    if (directionState) return;
    setDestination(null);
  }, [directionState, setDestination]);

  const handleMapLongPress = useCallback(
    e => {
      if (directionState) return;
      setDestination(e.nativeEvent.coordinate);
    },
    [directionState, setDestination]
  );

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
      !stationsNearOrigin.current?.[0] ||
      !stationsNearDestinaion.current?.[0]
    ) {
      Alert.alert('Error', 'Missing direction parameters');
      return;
    }

    const directionParams = {
      origin: myLocation,
      originStation: stationsNearOrigin.current[0].coordinate,
      destination,
      destinationStation: stationsNearDestinaion.current[0].coordinate,
    };

    setDirectionState({
      params: directionParams,
      state: 'loading',
      directions: null,
    });

    getDirections(directionParams)
      .then(directions => {
        setDirectionState({
          params: directionParams,
          state: 'success',
          directions,
        });
      })
      .catch(error => {
        setDirectionState(null);
        Alert.alert('Error', error.message);
      });
  };

  const handleDirectionsClear = () => {
    setDirectionState(null);
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
        {directionState?.directions && (
          <DirectionsPolyline directions={directionState.directions} />
        )}
      </MapView>
      <TopPanel isActivated={Boolean(directionState)}>
        <DirectionsControls onDirectionsClearPress={handleDirectionsClear} />
      </TopPanel>
      <BottomPanel
        isActivated={Boolean(destination)}
        afloatContent={
          <FindMyLocationButton onPress={handleFindMyLocationPress} />
        }
        panelContent={
          directionState ? (
            <DirectionsInfo directions={directionState.directions} />
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
