import type { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  icon: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
};

export default function FloatButton({
  onPress,
  icon,
  accessibilityLabel,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={styles.container}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    width: 56,
    backgroundColor: '#fff',
    borderRadius: 56,
    // boxShadow:
    //   'rgb(0 0 0 / 20%) 0px 3px 5px -1px, rgb(0 0 0 / 14%) 0px 6px 10px 0px, rgb(0 0 0 / 12%) 0px 1px 18px 0px;',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
  },
});
