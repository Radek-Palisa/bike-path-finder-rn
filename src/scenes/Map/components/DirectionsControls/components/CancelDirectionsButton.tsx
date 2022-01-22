import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import ChevronLeftIcon from '../../../../../components/icons/ChevronLeftIcon';

type Props = {
  onPress: () => void;
};

export default function CancelDirectionsButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      accessibilityLabel="Cancel directions"
      onPress={onPress}
    >
      <ChevronLeftIcon />
      <Text style={styles.text}>Cancel</Text>
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
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 12,
  },
  text: {
    paddingHorizontal: 8,
    fontSize: 16,
  },
});
