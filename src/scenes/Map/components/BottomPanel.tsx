import { View, StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
  isActivated: boolean;
};

export default function BottomPanel({ children, isActivated }: Props) {
  return (
    <View style={[styles.container, { bottom: isActivated ? 0 : -88 }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
  },
});
