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

/**
 * While Zoom Level should corresponds with Google Maps Zoom,
 * Zoom Grade is used to determine the size of the markers.
 */
export function getZoomGrade(zoomLevel: number): number {
  if (zoomLevel < 12) {
    return 0;
  }
  if (zoomLevel < 14) {
    return 1;
  }
  if (zoomLevel < 16) {
    return 2;
  }
  return 3;
}
