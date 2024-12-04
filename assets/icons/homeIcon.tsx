import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HomeIconProps {
    width?: number;
    height?: number;
    strokeColor?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
}

export default function HomeIcon({
    width = 30,
    height = 30,
    strokeColor = "black",
    strokeWidth = 1.5,
    strokeOpacity = 1,
    ...props
}: HomeIconProps) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 30 30"
            fill="none"
            {...props}
        >
            <Path
                d="M2.8125 15L14.0056 3.8069C14.5548 3.25773 15.4452 3.25773 15.9944 3.8069L27.1875 15M5.625 12.1875V24.8438C5.625 25.6204 6.2546 26.25 7.03125 26.25H12.1875V20.1563C12.1875 19.3796 12.8171 18.75 13.5938 18.75H16.4062C17.1829 18.75 17.8125 19.3796 17.8125 20.1563V26.25H22.9688C23.7454 26.25 24.375 25.6204 24.375 24.8438V12.1875M10.3125 26.25H20.625"
                stroke={strokeColor}
                strokeWidth={1.5}
                strokeOpacity={strokeOpacity}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};
