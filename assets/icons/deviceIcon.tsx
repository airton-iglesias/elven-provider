import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface DeviceIconProps {
    width?: number;
    height?: number;
    strokeColor?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
}

export default function DeviceIcon({
    width = 30,
    height = 30,
    strokeColor = "black",
    strokeWidth = 1.5,
    strokeOpacity = 0.6,
    ...props
}: DeviceIconProps) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 30 30"
            fill="none"
            {...props}
        >
            <Path
                d="M13.125 1.875H10.3125C8.7592 1.875 7.5 3.1342 7.5 4.6875V25.3125C7.5 26.8658 8.7592 28.125 10.3125 28.125H19.6875C21.2408 28.125 22.5 26.8658 22.5 25.3125V4.6875C22.5 3.1342 21.2408 1.875 19.6875 1.875H16.875M13.125 1.875V3.75H16.875V1.875M13.125 1.875H16.875M13.125 25.3125H16.875"
                stroke={strokeColor}
                strokeOpacity={strokeOpacity}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

