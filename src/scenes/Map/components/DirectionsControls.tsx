import CancelDirectionsButton from './CancelDirectionsButton';

type Props = {
  onDirectionsClearPress: () => void;
};

export default function DirectionsControls({ onDirectionsClearPress }: Props) {
  return <CancelDirectionsButton onPress={onDirectionsClearPress} />;
}
