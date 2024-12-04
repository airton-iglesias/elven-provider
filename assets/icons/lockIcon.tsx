import React from "react";
import Svg, { Path } from "react-native-svg";

export default function LockIcon() {
    return (
        <Svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <Path
                d="M20.625 13.125V8.4375C20.625 5.3309 18.1066 2.8125 15 2.8125C11.8934 2.8125 9.375 5.3309 9.375 8.4375V13.125M8.4375 27.1875H21.5625C23.1158 27.1875 24.375 25.9283 24.375 24.375V15.9375C24.375 14.3842 23.1158 13.125 21.5625 13.125H8.4375C6.8842 13.125 5.625 14.3842 5.625 15.9375V24.375C5.625 25.9283 6.8842 27.1875 8.4375 27.1875Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}