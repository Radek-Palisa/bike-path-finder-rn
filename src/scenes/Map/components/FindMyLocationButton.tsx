import { StyleSheet, TouchableOpacity } from 'react-native';
import FindLocationIcon from '../../../components/icons/FindLocationIcon';

type Props = {
  onPress: () => void;
};

export default function FindMyLocationButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel="Find my location"
      style={styles.container}
    >
      <FindLocationIcon />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: 56,
    backgroundColor: '#fff',
    borderRadius: 56,
    // boxShadow:
    //   'rgb(0 0 0 / 20%) 0px 3px 5px -1px, rgb(0 0 0 / 14%) 0px 6px 10px 0px, rgb(0 0 0 / 12%) 0px 1px 18px 0px;',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
  },
});
