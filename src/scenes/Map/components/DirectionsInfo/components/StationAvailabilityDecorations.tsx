import { StyleSheet, View } from 'react-native';
import LocationOnOutlinedIcon from '../../../../../components/icons/LocationOnOutlinedIcon';

export default function StationAvailabilityDecorations() {
  return (
    <View
      style={styles.decoration}
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.originIcon}>
        <View style={styles.originIconInner} />
      </View>
      <View style={styles.dotsContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <LocationOnOutlinedIcon width={20} fill="#DB504A" />
    </View>
  );
}

const styles = StyleSheet.create({
  decoration: {
    alignItems: 'center',
    marginRight: 10,
  },
  originIcon: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: '#4181EC26',
  },
  originIconInner: {
    width: 12,
    height: 12,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: '#4181EC',
  },
  dotsContainer: {
    height: 7,
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 2,
    backgroundColor: 'black',
  },
});
