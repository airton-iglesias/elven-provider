import React from "react";
import Svg, { Path } from "react-native-svg";

export default function UserIcon() {
    return (
        <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <Path
                d="M19.6875 7.5C19.6875 10.0888 17.5888 12.1875 15 12.1875C12.4112 12.1875 10.3125 10.0888 10.3125 7.5C10.3125 4.91117 12.4112 2.8125 15 2.8125C17.5888 2.8125 19.6875 4.91117 19.6875 7.5Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M5.6264 25.1478C5.71429 20.0461 9.87733 15.9375 15 15.9375C20.1228 15.9375 24.2859 20.0463 24.3736 25.1482C21.5201 26.4575 18.3455 27.1875 15.0004 27.1875C11.655 27.1875 8.4801 26.4574 5.6264 25.1478Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}