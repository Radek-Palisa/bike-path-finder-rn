import FloatButton from '../../../components/FloatButton';
import FindLocationIcon from '../../../components/icons/FindLocationIcon';

type Props = {
  onPress: () => void;
};

export default function FindMyLocationButton({ onPress }: Props) {
  return (
    <FloatButton
      icon={<FindLocationIcon />}
      onPress={onPress}
      accessibilityLabel="Find my location"
    />
  );
}
