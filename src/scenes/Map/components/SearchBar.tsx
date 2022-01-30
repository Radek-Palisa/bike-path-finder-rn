import { View, StyleSheet } from 'react-native';

export default function SearchBar() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 50,
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
  },
});
