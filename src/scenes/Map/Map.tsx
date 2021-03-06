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
import BottomSlideInPanel from './components/BottomSlideInPanel';
import FindMyLocationButton from './components/FindMyLocationButton';
import StationMarkers from './components/StationMarkers';
import type {
  StationsInfo,
  StationStatus,
  Bounds,
  DirectionState,
  ExtendedStationStatus,
  DirectionParams,
} from './services/types';
import useGetBikeStationsInfo from './services/useGetBikeStationsInfo';
import {
  areRouteStationsAvailable,
  findNearStations,
} from './services/nearStations';
import DirectionsPolyline from './components/DirectionsPolyline';
import TopSlideInPanel from './components/TopSlideInPanel';
import DirectionsControls from './components/DirectionsControls/DirectionsControls';
import getDirections from './services/directionsApi';
import { getZoomLevel } from './services/getZoomLevel';
import StationBottomSheet from './components/StationBottomSheet';
import RefreshDataButton from './components/RefreshDataButton';
import TopAfloat from './components/TopAfloat';
import SearchBar from './components/SearchBar';
import calculateDistance from './services/calculateDistance';

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
  const [tappedStation, setTappedStation] =
    useState<ExtendedStationStatus | null>(null);
  const stationsNearOrigin = useRef<ExtendedStationStatus[] | null>(null);
  const stationsNearDestinaion = useRef<ExtendedStationStatus[] | null>(null);
  const [bikeStationsInfo, setBikeStationsInfo] = useState<StationsInfo | null>(
    null
  );
  const [isInitialUserLocationKnown, setIsInitialUserLocationKnown] =
    useState<boolean>(false);
  const userLocation = useRef<LatLng | null>(null);
  const [isEbikeDirections, setIsEbikeDirections] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    getBikeStationsInfo()
      .then(setBikeStationsInfo)
      .catch(e => Alert.alert('Error', e.message));
  }, []);

  /**
   * When BikeStationsInfo gets set, find the stations
   * near the user's location.
   */
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
        limitByAvailability: isEbikeDirections ? 'bikesElectric' : 'bikesTotal',
      }
    );
  }, [bikeStationsInfo, isInitialUserLocationKnown, isEbikeDirections]);

  /** when the destination gets set, find the nearby stations */
  useEffect(() => {
    if (!destination) return;

    const nearStations = findNearStations(bikeStationsInfo, destination, {
      limitByAvailability: 'docks',
    });

    stationsNearDestinaion.current = nearStations;
  }, [destination]);

  /** find the tapped station in BikeStationsInfo and mark it as selected */
  useEffect(() => {
    if (tappedStation) {
      map.current?.animateCamera({
        center: tappedStation.coordinate,
      });
    }

    setBikeStationsInfo(prevState => {
      if (!prevState) return prevState;

      const shallowCopy = [...prevState];

      if (!tappedStation) {
        const index = shallowCopy.findIndex(([, { isSelected }]) => isSelected);

        if (index === -1) {
          return prevState;
        }

        shallowCopy[index][1].isSelected = false;
        return new Map(shallowCopy);
      }

      const updated: [number, StationStatus][] = shallowCopy.map(
        ([stationId, sta]) => {
          sta.isSelected = stationId === tappedStation.stationId;
          return [stationId, sta];
        }
      );

      return new Map(updated);
    });
  }, [tappedStation, setBikeStationsInfo]);

  const handleMapPress = useCallback(() => {
    setTappedStation(null);
    if (directionState) return;
    setDestination(null);
  }, [directionState, setDestination, setTappedStation]);

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

  const handleClearStationSelection = useCallback(
    () => setTappedStation(null),
    [setTappedStation]
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

  const setRoute = useCallback(
    (partialDirectionState: {
      params: DirectionParams;
      originStation: ExtendedStationStatus;
      destinationStation: ExtendedStationStatus;
    }) => {
      setDirectionState({
        ...partialDirectionState,
        state: 'loading',
        directions: null,
      });

      getDirections(partialDirectionState.params)
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
    },
    [setDirectionState]
  );

  const handleDirectionsReroute = (rerouteStation: ExtendedStationStatus) => {
    if (!userLocation.current || !destination) {
      Alert.alert('Error', 'Missing route parameters');
      return;
    }

    const distanceToOrigin = calculateDistance(
      rerouteStation.coordinate,
      userLocation.current
    );
    const distanceToDest = calculateDistance(
      rerouteStation.coordinate,
      destination
    );

    const originStation =
      distanceToOrigin <= distanceToDest
        ? rerouteStation
        : stationsNearOrigin.current?.[0];
    const destinationStation =
      distanceToOrigin > distanceToDest
        ? rerouteStation
        : stationsNearDestinaion.current?.[0];

    if (!originStation || !destinationStation) {
      Alert.alert('Error', 'Missing route parameters');
      return;
    }

    const directionParams = {
      origin: userLocation.current,
      originStation: originStation.coordinate,
      destinationStation: destinationStation.coordinate,
      destination,
    };

    setRoute({
      params: directionParams,
      originStation,
      destinationStation,
    });
  };

  const handleDirectionsPress = () => {
    const nearestStation = stationsNearOrigin.current?.[0];
    const nearestDestinationStation = stationsNearDestinaion.current?.[0];

    if (
      !userLocation.current ||
      !destination ||
      !nearestStation ||
      !nearestDestinationStation
    ) {
      Alert.alert('Error', 'Missing direction parameters');
      return;
    }

    const directionParams = {
      origin: userLocation.current,
      originStation: nearestStation.coordinate,
      destination,
      destinationStation: nearestDestinationStation.coordinate,
    };

    setRoute({
      params: directionParams,
      originStation: nearestStation,
      destinationStation: nearestDestinationStation,
    });
  };

  const handleDirectionsClear = () => {
    setDirectionState(null);
  };

  const handleRouteSelect = (routeIndex: number) => {
    if (!directionState?.directions) return;

    const selectedRoute = directionState.directions.cycling[routeIndex];

    handleClearStationSelection();

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

  const handleRefreshData = () => {
    getBikeStationsInfo()
      .then(stationsInfo => {
        if (directionState) {
          const originStation = stationsInfo.get(
            directionState.originStation.stationId
          );
          const destinationStation = stationsInfo.get(
            directionState.destinationStation.stationId
          );

          const areStationsAvailable = areRouteStationsAvailable({
            originStation,
            destinationStation,
          });

          if (areStationsAvailable) {
            // TODO: use a modal
            Alert.alert(
              'Hey there',
              `It seems that the bicing stations on your route have changed their status.\n\n${JSON.stringify(
                { originStation, destinationStation },
                null,
                4
              )}`
            );
          }
        }

        setBikeStationsInfo(stationsInfo);
      })
      .catch(e => Alert.alert('Error', e.message));
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
        {destination && (
          <Marker
            // key is to prevent animation
            key={`key=${destination.latitude}_${destination.longitude}`}
            coordinate={destination}
          />
        )}
        {bikeStationsInfo && (
          <StationMarkers
            data={bikeStationsInfo}
            zoomedInBounds={zoomedInMapBounds}
            onStationPress={setTappedStation}
          />
        )}
        {directionState?.directions && (
          <DirectionsPolyline directions={directionState.directions} />
        )}
      </MapView>
      <TopAfloat>
        <SearchBar destination={destination} />
      </TopAfloat>
      <TopSlideInPanel
        isActivated={Boolean(directionState)}
        afloatContent={<RefreshDataButton onPress={handleRefreshData} />}
        panelContent={
          <DirectionsControls
            onDirectionsClearPress={handleDirectionsClear}
            directions={directionState?.directions}
            onRouteSelect={handleRouteSelect}
          />
        }
      />
      <BottomSlideInPanel
        isActivated={Boolean(destination)}
        afloatContent={
          <FindMyLocationButton onPress={handleFindMyLocationPress} />
        }
        panelContent={
          directionState ? (
            <DirectionsInfo directionState={directionState} />
          ) : (
            <DroppedPinMenu
              onDirectionsPress={handleDirectionsPress}
              onSetEbikeDirections={setIsEbikeDirections}
              isEbikeDirections={isEbikeDirections}
            />
          )
        }
      />
      <StationBottomSheet
        station={tappedStation}
        onDirectionsReroute={
          directionState ? handleDirectionsReroute : undefined
        }
        onClose={handleClearStationSelection}
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
