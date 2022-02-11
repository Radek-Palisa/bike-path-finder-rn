import { View, StyleSheet, Text } from 'react-native';
import { LatLng } from 'react-native-maps';
import UserAvatar from '../../../components/UserAvatar';

type Props = {
  destination: LatLng | null;
};

export default function SearchBar({ destination }: Props) {
  return (
    <View style={styles.container}>
      {destination ? (
        <Text style={styles.searchText}>
          {`${parseFloat(destination.latitude.toFixed(4))},${parseFloat(
            destination.longitude.toFixed(4)
          )}`}
        </Text>
      ) : (
        <Text style={styles.placeholder}>Place a pin on the map</Text>
      )}
      <UserAvatar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
  },
  searchText: {
    fontSize: 18,
  },
  placeholder: {
    fontSize: 18,
    color: '#919191',
  },
});
