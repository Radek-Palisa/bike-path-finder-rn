import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

export default function ChevronLeftIcon({
  width = 24,
  height = 24,
  ...props
}: SvgProps) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      {...props}
    >
      <Path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z" fill="#5f6368" />
    </Svg>
  );
}
