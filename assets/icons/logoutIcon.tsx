import React from "react";
import Svg, { Path } from "react-native-svg";

export default function LogoutIcon() {
    return (
        <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <Path
                d="M10.3125 11.25V6.5625C10.3125 5.0092 11.5717 3.75 13.125 3.75H20.625C22.1783 3.75 23.4375 5.0092 23.4375 6.5625V23.4375C23.4375 24.9908 22.1783 26.25 20.625 26.25H13.125C11.5717 26.25 10.3125 24.9908 10.3125 23.4375V18.75M6.5625 18.75L2.8125 15M2.8125 15L6.5625 11.25M2.8125 15L18.75 15"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}