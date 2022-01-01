import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import DirectionsIcon from '../../../components/icons/DirectionsIcon';

type Props = {
  onPress: () => void;
};

export default function DirectionsButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <DirectionsIcon />
      <Text style={styles.text}>Directions</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 10,
    paddingLeft: 15,
    backgroundColor: '#4181EC',
    borderRadius: 36,
    fontWeight: 'bold', // doesn't work
  },
  text: {
    color: '#fff',
    paddingHorizontal: 10,
  },
});
