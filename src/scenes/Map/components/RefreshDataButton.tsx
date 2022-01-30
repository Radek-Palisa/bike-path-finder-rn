import { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import FloatButton from '../../../components/FloatButton';
import LoopIcon from '../../../components/icons/LoopIcon';

const REFRESH_DATA_THROTTLE_MS = 4000;

type Props = {
  onPress: () => void;
};

export default function RefreshDataButton({ onPress }: Props) {
  const isThrottling = useRef<boolean>(false);

  const handlePress = () => {
    if (isThrottling.current) return;
    isThrottling.current = true;
    onPress();
    setTimeout(() => (isThrottling.current = false), REFRESH_DATA_THROTTLE_MS);
  };

  return (
    <View style={styles.container}>
      <FloatButton
        onPress={handlePress}
        accessibilityLabel="refetch bike stations information"
        icon={<LoopIcon />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});
