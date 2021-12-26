import { useRef, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import type { LatLng } from 'react-native-maps';
import DroppedPinMenu from './components/DroppedPinMenu';
import BottomPanel from './components/BottomPanel';
import FindMyLocationButton from './components/FindMyLocationButton';
import useMyLocation from './services/useMyLocation';
import MyLocationMarker from './components/MyLocationMarker';
import useGetBicingStationsGeoData from './services/useGetBicingStationsGeoData';
import StationMarkers from './components/StationMarkers';

export default function Map() {
  const map = useRef<MapView | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const myLocation = useMyLocation();
  const bicingStationsGeoData = useGetBicingStationsGeoData();

  const handleFindMyLocationPress = () => {
    if (!myLocation) return;
    map.current?.animateCamera({
      center: myLocation,
      zoom: 16,
    });
  };

  const handleDirectionsPress = () => {
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
        {/* {bicingStationsGeoData && (
          <Geojson
            geojson={bicingStationsGeoData}
            onPress={e => console.log(e)}
          />
        )} */}
        {/* {bicingStationsGeoData &&
          bicingStationsGeoData.features.map(({ id, geometry }) => (
            <Marker
              key={id}
              coordinate={{
                longitude: geometry.coordinates[0],
                latitude: geometry.coordinates[1],
              }}
            />
          ))} */}
        {bicingStationsGeoData && (
          <StationMarkers data={bicingStationsGeoData} />
        )}
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
