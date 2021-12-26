import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  onPress: () => void;
};

export default function DirectionsButton({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.text}>Directions</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: '#4181EC',
    borderRadius: 36,
    // fontWeight: '500', // doesn't work
  },
  text: {
    color: '#fff',
  },
});
