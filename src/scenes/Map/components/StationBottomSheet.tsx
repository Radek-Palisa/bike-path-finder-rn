import BottomSheet from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExtendedStationStatus } from '../services/types';

const bottomSheetSnapPoints = ['25%'];

type Props = {
  station: ExtendedStationStatus | null;
  onClose: () => void;
};

export default function StationBottomSheet({ station, onClose }: Props) {
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
        <Text>Station ID: {station?.stationId}</Text>
        <Text>Mechanical bikes: {station?.availableMechanical}</Text>
        <Text>Electric bikes: {station?.availableElectric}</Text>
        <Text>Available docks: {station?.availableDocks}</Text>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
