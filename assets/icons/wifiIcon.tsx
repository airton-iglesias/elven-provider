import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface WifiIconProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
}

export default function WifiIcon({
  width = 30,
  height = 30,
  strokeColor = "black",
  strokeWidth = 1.5,
  strokeOpacity = 1,
  ...props
}: WifiIconProps) {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
      {...props}
    >
      <Path
        d="M10.3595 18.7972C12.9223 16.2344 17.0775 16.2344 19.6403 18.7972M6.38202 14.8197C11.1415 10.0602 18.8582 10.0602 23.6177 14.8197M2.40454 10.8422C9.36075 3.88595 20.639 3.88595 27.5952 10.8422M15.6628 22.7747L14.9999 23.4376L14.337 22.7747C14.7031 22.4085 15.2967 22.4085 15.6628 22.7747Z"
        stroke={strokeColor}
        strokeOpacity={strokeOpacity}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
