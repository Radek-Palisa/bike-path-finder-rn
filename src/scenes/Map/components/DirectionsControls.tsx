import type { Directions } from '../services/types';
import CancelDirectionsButton from './CancelDirectionsButton';

type Props = {
  onDirectionsClearPress: () => void;
  onRouteSelect: (routeIndex: number) => void;
  directions?: Directions | null;
};

export default function DirectionsControls({ onDirectionsClearPress }: Props) {
  return <CancelDirectionsButton onPress={onDirectionsClearPress} />;
}
