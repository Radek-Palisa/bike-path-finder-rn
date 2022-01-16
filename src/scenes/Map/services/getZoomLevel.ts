/**
 * https://stackoverflow.com/questions/57737356/how-to-get-zoom-level-in-react-native-map
 * the solution in stackoverflow mentions adding + 1 to the result of Math.log2
 * but this seems be +1 to what react-native-maps' zoom is, so I've removed it
 */
export function getZoomLevel(
  windowWidth: number,
  longitudeDelta: number
): number {
  return Math.round(Math.log2(360 * (windowWidth / 256 / longitudeDelta)));
}
