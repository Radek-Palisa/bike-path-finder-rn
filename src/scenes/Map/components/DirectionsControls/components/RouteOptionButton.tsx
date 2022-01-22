import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import DirectionsBikeIcon from '../../../../../components/icons/DirectionsBikeIcon';

type Props = {
  onPress: () => void;
  text: string;
  isSelected: boolean;
};

export default function RouteOptionButton({
  onPress,
  text,
  isSelected,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerIsSelected]}
      accessibilityLabel="Cancel directions"
      onPress={onPress}
    >
      <DirectionsBikeIcon
        width={18}
        fill={isSelected ? '#4181EC' : undefined}
      />
      <Text style={[styles.text, isSelected && styles.textIsSelected]}>
        {text}
      </Text>
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
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
  },
  containerIsSelected: {
    borderWidth: 1,
    borderColor: '#4181EC',
    backgroundColor: '#4181EC26',
  },
  text: {
    paddingLeft: 6,
    fontSize: 14,
    color: '#5f6368',
  },
  textIsSelected: {
    color: '#4181EC',
  },
});
