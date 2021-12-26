import * as React from 'react';
import Svg, { SvgProps, Circle, Path } from 'react-native-svg';

export default function MyLocationIcon(props: SvgProps) {
  return (
    <Svg
      width={32}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={16} cy={16} r={16} fill="#4181EC" fillOpacity={0.2} />
      <Path d="M24 16a8 8 0 1 1-16 0 8 8 0 0 1 16 0z" fill="#4181EC" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 23a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0 1a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
        fill="#fff"
      />
    </Svg>
  );
}
