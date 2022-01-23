/**
 * Zoom level rounded to 1 decimal place.
 * Formula taken from:
 * https://stackoverflow.com/questions/57737356/how-to-get-zoom-level-in-react-native-map
 * the solution in stackoverflow mentions adding + 1 to the result of Math.log2
 * but this seems be +1 to what react-native-maps' zoom is, so I've removed it
 */
export function getZoomLevel(
  windowWidth: number,
  longitudeDelta: number
): number {
  const preciseZoomLevel = Math.log2(
    360 * (windowWidth / 256 / longitudeDelta)
  );
  return Math.round(preciseZoomLevel * 10) / 10;
}
