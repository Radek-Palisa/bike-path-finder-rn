import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

export default function RouteIcon({
  width = 24,
  height = width,
  fill = '#5f6368',
  ...props
}: SvgProps) {
  return (
    <Svg
      viewBox="0 0 24 24"
      {...props}
      width={width}
      height={height}
      fill={fill}
    >
      <Path d="M19 15.18V7c0-2.21-1.79-4-4-4s-4 1.79-4 4v10c0 1.1-.9 2-2 2s-2-.9-2-2V8.82C8.16 8.4 9 7.3 9 6c0-1.66-1.34-3-3-3S3 4.34 3 6c0 1.3.84 2.4 2 2.82V17c0 2.21 1.79 4 4 4s4-1.79 4-4V7c0-1.1.9-2 2-2s2 .9 2 2v8.18A2.996 2.996 0 0 0 18 21c1.66 0 3-1.34 3-3 0-1.3-.84-2.4-2-2.82z" />
    </Svg>
  );
}
