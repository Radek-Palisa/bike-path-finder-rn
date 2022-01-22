import { StyleSheet, Text, View } from 'react-native';
import BikeDockIcon from '../../../../../components/icons/BikeDockIcon';
import ElectricBikeRoundedIcon from '../../../../../components/icons/ElectricBikeRoundedIcon';
import PedalBikeRoundedIcon from '../../../../../components/icons/PedalBikeRoundedIcon';
import type { StationStatus } from '../../../services/types';
import StationAvailabilityDecorations from './StationAvailabilityDecorations';

type Props = {
  originStation: StationStatus;
  destinationStation: StationStatus;
};

export default function StationAvailabilityInfo({
  originStation,
  destinationStation,
}: Props) {
  return (
    <View style={styles.container}>
      <StationAvailabilityDecorations />
      <View style={styles.availabilityContainer}>
        <View style={styles.availableBikes}>
          <Text style={styles.availableBikesText}>
            {originStation.availableMechanical}{' '}
          </Text>
          <PedalBikeRoundedIcon width={20} />
          <Text style={styles.availableBikesText}>
            {'  '}
            {originStation.availableElectric}{' '}
          </Text>
          <ElectricBikeRoundedIcon style={{ marginTop: 2 }} width={20} />
        </View>
        <View style={styles.availableDocks}>
          <Text style={styles.availableDocksText}>
            {destinationStation.availableDocks}{' '}
          </Text>
          <BikeDockIcon width={15} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  availabilityContainer: {
    justifyContent: 'space-between',
    paddingBottom: 1,
  },
  availableBikes: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  availableBikesText: {
    marginTop: 2,
    color: '#282828',
  },
  availableDocks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableDocksText: {
    color: '#282828',
  },
});
