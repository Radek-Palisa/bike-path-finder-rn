import { useCallback, useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  Alert,
  useWindowDimensions,
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Region,
  EventUserLocation,
} from 'react-native-maps';
import type { LatLng, Camera, MapEvent } from 'react-native-maps';
import DroppedPinMenu from './components/DroppedPinMenu';
import DirectionsInfo from './components/DirectionsInfo/DirectionsInfo';
import BottomPanel from './components/BottomPanel';
import FindMyLocationButton from './components/FindMyLocationButton';
import StationMarkers from './components/StationMarkers';
import type {
  StationsInfo,
  StationStatus,
  Bounds,
  DirectionState,
} from './services/types';
import useGetBikeStationsInfo from './services/useGetBikeStationsInfo';
import { findNearStations } from './services/nearStations';
import DirectionsPolyline from './components/DirectionsPolyline';
import TopPanel from './components/TopPanel';
import DirectionsControls from './components/DirectionsControls/DirectionsControls';
import getDirections from './services/directionsApi';
import { getZoomLevel } from './services/getZoomLevel';

const isZoomedInLevel = 15;
const initialZoomLevel = 14;

const initialCamera: Camera = {
  /** Pl. Catalunya */
  center: {
    latitude: 41.3870531,
    longitude: 2.17006,
  },
  zoom: initialZoomLevel,
  pitch: 0,
  heading: 0,
  altitude: 0,
} as const;

export default function MapScene() {
  const window = useWindowDimensions();
  const map = useRef<MapView | null>(null);
  const [zoomedInMapBounds, setZoomedInMapBounds] = useState<Bounds | null>(
    null
  );
  const getBikeStationsInfo = useGetBikeStationsInfo();
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [directionState, setDirectionState] = useState<DirectionState>(null);
  const stationsNearOrigin = useRef<StationStatus[] | null>(null);
  const stationsNearDestinaion = useRef<StationStatus[] | null>(null);
  const [bikeStationsInfo, setBikeStationsInfo] = useState<StationsInfo | null>(
    null
  );
  const [isInitialUserLocationKnown, setIsInitialUserLocationKnown] =
    useState<boolean>(false);
  const userLocation = useRef<LatLng | null>(null);

  useEffect(() => {
    getBikeStationsInfo()
      .then(setBikeStationsInfo)
      .catch(e => Alert.alert('Error', e.message));
  }, []);

  useEffect(() => {
    if (
      !bikeStationsInfo ||
      !isInitialUserLocationKnown ||
      !userLocation.current
    ) {
      return;
    }

    stationsNearOrigin.current = findNearStations(
      bikeStationsInfo,
      userLocation.current,
      {
        limitByAvailability: 'bikesTotal',
      }
    );
  }, [bikeStationsInfo, isInitialUserLocationKnown]);

  useEffect(() => {
    if (!destination) return;

    const nearStations = findNearStations(bikeStationsInfo, destination, {
      limitByAvailability: 'docks',
    });

    stationsNearDestinaion.current = nearStations;
  }, [destination]);

  const handleMapPress = useCallback(() => {
    if (directionState) return;
    setDestination(null);
  }, [directionState, setDestination]);

  const handleMapLongPress = useCallback(
    (e: MapEvent) => {
      if (directionState) return;

      // if pressed at the bottom of the screen,
      // the slide-up bottom panel will hide the destination
      // marker, so center the marker to the middle of the screen.
      if (window.height - e.nativeEvent.position.y < 120) {
        map.current?.animateCamera({
          center: e.nativeEvent.coordinate,
        });
      }

      setDestination(e.nativeEvent.coordinate);
    },
    [directionState, window, setDestination]
  );

  const handleUserLocationChange = useCallback(
    ({ nativeEvent }: EventUserLocation) => {
      if (!isInitialUserLocationKnown) {
        setIsInitialUserLocationKnown(true);
      }
      userLocation.current = nativeEvent.coordinate;
    },
    [isInitialUserLocationKnown, setIsInitialUserLocationKnown]
  );

  const handleRegionChange = (region: Region) => {
    const newZoomLevel = getZoomLevel(window.width, region.longitudeDelta);
    const isZoomedIn = newZoomLevel >= isZoomedInLevel;
    const isAlreadyZoomedIn = Boolean(zoomedInMapBounds);

    if (isAlreadyZoomedIn !== isZoomedIn) {
      // if transitioning from zoomed-out to zoomed-in
      if (isAlreadyZoomedIn === false) {
        map.current?.getMapBoundaries().then(setZoomedInMapBounds);
        return;
      }
      setZoomedInMapBounds(null);
    }
  };

  const handleFindMyLocationPress = () => {
    if (!userLocation.current) return;
    map.current?.animateCamera({
      center: userLocation.current,
      zoom: 16,
    });
  };

  const handleDirectionsPress = () => {
    if (
      !userLocation.current ||
      !destination ||
      !stationsNearOrigin.current?.[0] ||
      !stationsNearDestinaion.current?.[0]
    ) {
      Alert.alert('Error', 'Missing direction parameters');
      return;
    }

    const nearestStation = stationsNearOrigin.current[0];
    const nearestDestinationStation = stationsNearDestinaion.current[0];

    const directionParams = {
      origin: userLocation.current,
      originStation: nearestStation.coordinate,
      destination,
      destinationStation: nearestDestinationStation.coordinate,
    };

    const partialDirectionState = {
      params: directionParams,
      originStation: nearestStation,
      destinationStation: nearestDestinationStation,
    };

    setDirectionState({
      ...partialDirectionState,
      state: 'loading',
      directions: null,
    });

    getDirections(directionParams)
      .then(directions => {
        map.current?.fitToCoordinates(
          [
            directions.cycling[0].totalBounds.northEast,
            directions.cycling[0].totalBounds.southWest,
          ],
          {
            edgePadding: {
              top: 150,
              right: 25,
              bottom: 150,
              left: 25,
            },
          }
        );
        setDirectionState({
          ...partialDirectionState,
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

  const handleRouteSelect = (routeIndex: number) => {
    if (!directionState?.directions) return;

    const selectedRoute = directionState.directions.cycling[routeIndex];

    // pan to the route bounds even if clicking on the already selected route
    map.current?.fitToCoordinates(
      [
        selectedRoute.totalBounds.northEast,
        selectedRoute.totalBounds.southWest,
      ],
      {
        edgePadding: {
          top: 150,
          right: 25,
          bottom: 150,
          left: 25,
        },
      }
    );

    // i.e. if not already selected
    if (!selectedRoute.isSelected) {
      setDirectionState({
        ...directionState,
        directions: {
          ...directionState.directions,
          cycling: directionState.directions.cycling.map((route, index) => ({
            ...route,
            isSelected: index === routeIndex,
          })),
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <MapView
        showsUserLocation
        ref={map}
        initialCamera={initialCamera}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        onLongPress={handleMapLongPress}
        onPress={handleMapPress}
        onRegionChange={handleRegionChange}
        onUserLocationChange={handleUserLocationChange}
      >
        {destination && <Marker coordinate={destination} />}
        {bikeStationsInfo && (
          <StationMarkers
            data={bikeStationsInfo}
            zoomedInBounds={zoomedInMapBounds}
          />
        )}
        {directionState?.directions && (
          <DirectionsPolyline directions={directionState.directions} />
        )}
      </MapView>
      <TopPanel isActivated={Boolean(directionState)}>
        <DirectionsControls
          onDirectionsClearPress={handleDirectionsClear}
          directions={directionState?.directions}
          onRouteSelect={handleRouteSelect}
        />
      </TopPanel>
      <BottomPanel
        isActivated={Boolean(destination)}
        afloatContent={
          <FindMyLocationButton onPress={handleFindMyLocationPress} />
        }
        panelContent={
          directionState ? (
            <DirectionsInfo directionState={directionState} />
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
