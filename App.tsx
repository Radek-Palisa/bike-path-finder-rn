import { SafeAreaProvider } from 'react-native-safe-area-context';
import Map from './src/scenes/Map/Map';

export default function App() {
  return (
    <SafeAreaProvider>
      <Map />
    </SafeAreaProvider>
  );
}
