import { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import LoopIcon from '../../../components/icons/LoopIcon';

const REFRESH_DATA_THROTTLE_MS = 4000;

type Props = {
  onPress: () => void;
};

export default function RefreshDataButton({ onPress }: Props) {
  const isThrottling = useRef<boolean>(false);
  const offset = useSharedValue(0);
  const opacity = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${offset.value}deg` }],
  }));
  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handlePress = () => {
    offset.value = withTiming(offset.value - 360, {
      duration: 1000,
      easing: Easing.bezier(0.25, 1, 0.5, 1),
    });
    opacity.value += 1;
    opacity.value = withDelay(900, withTiming(0, { duration: 300 }));
    if (isThrottling.current) return;
    isThrottling.current = true;
    onPress();
    setTimeout(() => (isThrottling.current = false), REFRESH_DATA_THROTTLE_MS);
  };

  return (
    <View style={styles.container}>
      <Pressable
        android_disableSound
        accessibilityLabel="refetch bike stations information"
        onPress={handlePress}
      >
        <View style={styles.iconContainer}>
          <LoopIcon />
        </View>
        <Animated.View
          style={[
            styles.iconContainer,
            styles.animatedIconContainer,
            animatedStyles,
            animatedOpacity,
          ]}
        >
          <LoopIcon fill="#4181EC" />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 42,
    borderRadius: 42,
    backgroundColor: '#fff',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedIconContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 42,
  },
});
