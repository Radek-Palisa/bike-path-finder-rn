import BottomSheet from '@gorhom/bottom-sheet';
import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BikeDockIcon from '../../../components/icons/BikeDockIcon';
import ElectricBikeRoundedIcon from '../../../components/icons/ElectricBikeRoundedIcon';
import PedalBikeRoundedIcon from '../../../components/icons/PedalBikeRoundedIcon';
import { ExtendedStationStatus } from '../services/types';

const bottomSheetSnapPoints = ['25%'];

type Props = {
  station: ExtendedStationStatus | null;
  onClose: () => void;
  onDirectionsReroute?: (rerouteStation: ExtendedStationStatus) => void;
};

export default function StationBottomSheet({
  station,
  onClose,
  onDirectionsReroute,
}: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const isInitiliazed = useRef(false);
  const isBeingClosedByTappingOutside = useRef(false);

  useEffect(() => {
    if (!isInitiliazed.current) {
      isInitiliazed.current = true;
      return;
    }

    if (station) {
      return bottomSheetRef.current?.expand();
    }

    isBeingClosedByTappingOutside.current = true;
    bottomSheetRef.current?.close();
  }, [station]);

  const handleChange = (index: number) => {
    if (index === -1) {
      if (isBeingClosedByTappingOutside.current) {
        isBeingClosedByTappingOutside.current = false;
        return;
      }
      isInitiliazed.current = false;
      onClose();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={bottomSheetSnapPoints}
      enablePanDownToClose
      onChange={handleChange}
    >
      <View style={styles.container}>
        <Text style={styles.addressText}>{station?.address}</Text>
        <View style={styles.stationAvailability}>
          <View style={styles.stationAvailabilityItem}>
            <PedalBikeRoundedIcon style={[styles.icon, { bottom: 2 }]} />
            <Text style={styles.digit}>{station?.availableMechanical}</Text>
          </View>
          <View style={styles.stationAvailabilityItem}>
            <ElectricBikeRoundedIcon style={[styles.icon, { bottom: -1 }]} />
            <Text style={styles.digit}>{station?.availableElectric}</Text>
          </View>
          <View style={styles.stationAvailabilityItem}>
            <BikeDockIcon
              width={18}
              style={[styles.icon, { bottom: 6, left: 5 }]}
            />
            <Text style={styles.digit}>{station?.availableDocks}</Text>
          </View>
        </View>
        {onDirectionsReroute && station && (
          <View style={styles.rerouteButtonContainer}>
            <TouchableOpacity
              style={styles.rerouteButton}
              onPress={() => onDirectionsReroute(station)}
            >
              <Text style={styles.rerouteButtonText}>Use this station</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  addressText: {
    textAlign: 'center',
  },
  stationAvailability: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  stationAvailabilityItem: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 32,
    marginHorizontal: 8,
  },
  icon: {
    position: 'absolute',
    left: 0,
  },
  digit: {
    fontSize: 24,
  },
  rerouteButtonContainer: {
    alignItems: 'center',
  },
  rerouteButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: '#DB504A',
  },
  rerouteButtonText: {
    color: 'white',
  },
});
