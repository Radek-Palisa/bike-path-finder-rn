import { View, StyleSheet, Text } from 'react-native';
import { LatLng } from 'react-native-maps';

type Props = {
  destination: LatLng | null;
};

export default function SearchBar({ destination }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.searchText}>
        {destination &&
          `${parseFloat(destination.latitude.toFixed(4))},${parseFloat(
            destination.longitude.toFixed(4)
          )}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    paddingLeft: 20,
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
});
