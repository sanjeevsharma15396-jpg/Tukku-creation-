import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

interface BrandLogoProps {
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 64 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <Defs>
          <LinearGradient id="tukkuGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#7C3AED" />
            <Stop offset="0.55" stopColor="#9333EA" />
            <Stop offset="1" stopColor="#C084FC" />
          </LinearGradient>
          <LinearGradient id="tukkuInner" x1="16" y1="16" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#F5F3FF" />
            <Stop offset="1" stopColor="#DDD6FE" />
          </LinearGradient>
        </Defs>
        <Rect x="4" y="4" width="72" height="72" rx="22" fill="#130B24" stroke="url(#tukkuGrad)" strokeWidth="2.5" />
        <Path
          d="M23 26H57V34H44V56H36V34H23V26Z"
          fill="url(#tukkuInner)"
        />
        <Path
          d="M52 44C52 38.4772 56.4772 34 62 34V40C59.7909 40 58 41.7909 58 44C58 46.2091 59.7909 48 62 48V54C56.4772 54 52 49.5228 52 44Z"
          fill="url(#tukkuGrad)"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
