import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface MoneyIconProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
}

export default function MoneyIcon({
  width = 30,
  height = 30,
  strokeColor = "black",
  strokeWidth = 1.5,
  strokeOpacity = 1,
  ...props
}: MoneyIconProps) {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"
      {...props}
    >
      <Path
        d="M2.8125 23.4375C9.64649 23.4375 16.267 24.3515 22.5584 26.064C23.4672 26.3114 24.375 25.6357 24.375 24.6939V23.4375M4.6875 5.625V6.5625C4.6875 7.08027 4.26777 7.5 3.75 7.5H2.8125M2.8125 7.5V7.03125C2.8125 6.2546 3.4421 5.625 4.21875 5.625H25.3125M2.8125 7.5V18.75M25.3125 5.625V6.5625C25.3125 7.08027 25.7322 7.5 26.25 7.5H27.1875M25.3125 5.625H25.7812C26.5579 5.625 27.1875 6.2546 27.1875 7.03125V19.2188C27.1875 19.9954 26.5579 20.625 25.7812 20.625H25.3125M27.1875 18.75H26.25C25.7322 18.75 25.3125 19.1697 25.3125 19.6875V20.625M25.3125 20.625H4.6875M4.6875 20.625H4.21875C3.4421 20.625 2.8125 19.9954 2.8125 19.2188V18.75M4.6875 20.625V19.6875C4.6875 19.1697 4.26777 18.75 3.75 18.75H2.8125M18.75 13.125C18.75 15.1961 17.0711 16.875 15 16.875C12.9289 16.875 11.25 15.1961 11.25 13.125C11.25 11.0539 12.9289 9.375 15 9.375C17.0711 9.375 18.75 11.0539 18.75 13.125ZM22.5 13.125H22.5094V13.1344H22.5V13.125ZM7.5 13.125H7.50938V13.1344H7.5V13.125Z"
        stroke={strokeColor}
        strokeOpacity={strokeOpacity}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
