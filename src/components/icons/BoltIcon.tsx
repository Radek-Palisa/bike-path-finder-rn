import Svg, { SvgProps, Path } from 'react-native-svg';

export default function BoltIcon({
  width = 24,
  height = width,
  fill = '#5f6368',
  ...props
}: SvgProps) {
  return (
    <Svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill={fill}
      {...props}
    >
      <Path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z" />
    </Svg>
  );
}
