import Svg, { SvgProps, Path } from 'react-native-svg';

export default function BikeDockIcon({
  width = 30,
  height = (width as number) * 0.8333, // 25
  fill = '#5f6368',
  ...props
}: SvgProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 30 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.7237 0H19.2763L21.2133 20.2417C28.4709 20.8689 30 22.5 30 22.5V25H15H0V22.5C0 22.5 1.52912 20.8689 8.78668 20.2417L10.7237 0ZM13.1569 20.0186C13.7456 20.0064 14.3596 20 15 20C15.5317 20 16.0452 20.0044 16.541 20.0129L15.9375 2.8125H14.0625L13.1569 20.0186Z"
        fill={fill}
      />
    </Svg>
  );
}
