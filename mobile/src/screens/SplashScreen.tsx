import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BrandLogo } from '../components/BrandLogo';
import { useApp } from '../context/AppContext';
import { COLORS, RADIUS } from '../theme/colors';

export const SplashScreen: React.FC = () => {
  const { dismissSplash, t } = useApp();

  const logoScale = useRef(new Animated.Value(0.84)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const outerRotation = useRef(new Animated.Value(0)).current;
  const innerRotation = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const spinOuter = Animated.loop(
      Animated.timing(outerRotation, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const spinInner = Animated.loop(
      Animated.timing(innerRotation, {
        toValue: 1,
        duration: 6500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const auraPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.08,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 0.95,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    spinOuter.start();
    spinInner.start();
    auraPulse.start();

    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          dismissSplash();
        }
      });
    }, 2400);

    return () => {
      clearTimeout(timer);
      spinOuter.stop();
      spinInner.stop();
      auraPulse.stop();
    };
  }, [contentOpacity, dismissSplash, innerRotation, logoScale, outerRotation, pulseScale, screenOpacity]);

  const outerSpin = outerRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const innerSpin = innerRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <LinearGradient
        colors={['#06050A', '#170A2E', '#090612']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.orbitStage}>
          <Animated.View
            style={[
              styles.auraGlow,
              { transform: [{ scale: pulseScale }] },
            ]}
          />
          <Animated.View
            style={[
              styles.outerRing,
              { transform: [{ rotate: outerSpin }] },
            ]}
          >
            <View style={styles.orbitNodePrimary} />
          </Animated.View>
          <Animated.View
            style={[
              styles.innerRing,
              { transform: [{ rotate: innerSpin }] },
            ]}
          >
            <View style={styles.orbitNodeSecondary} />
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: logoScale }] }}>
            <BrandLogo size={92} />
          </Animated.View>
        </View>

        <Animated.View style={[styles.textBlock, { opacity: contentOpacity }]}>
          <Text style={styles.brandTitle}>{t.appName}</Text>
          <Text style={styles.tagline}>{t.tagline}</Text>
          <Text style={styles.subtext}>{t.splashSubtext}</Text>
        </Animated.View>

        <Pressable
          onPress={dismissSplash}
          accessibilityRole="button"
          accessibilityLabel={t.enterStudio}
          style={styles.skipButton}
        >
          <Text style={styles.skipLabel}>{t.enterStudio}</Text>
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  orbitStage: {
    width: 196,
    height: 196,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  auraGlow: {
    position: 'absolute',
    width: 172,
    height: 172,
    borderRadius: 86,
    backgroundColor: 'rgba(124, 58, 237, 0.22)',
  },
  outerRing: {
    position: 'absolute',
    width: 184,
    height: 184,
    borderRadius: 92,
    borderWidth: 1.2,
    borderColor: 'rgba(167, 139, 250, 0.28)',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  innerRing: {
    position: 'absolute',
    width: 142,
    height: 142,
    borderRadius: 71,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.35)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  orbitNodePrimary: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#C084FC',
    marginTop: -5,
  },
  orbitNodeSecondary: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#7C3AED',
    marginBottom: -4,
  },
  textBlock: {
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  subtext: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
  },
  skipButton: {
    position: 'absolute',
    bottom: 48,
    minHeight: 44,
    paddingHorizontal: 22,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.26)',
    backgroundColor: 'rgba(20, 14, 36, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipLabel: {
    color: COLORS.textSecondary,
    fontSize: 13.5,
    fontWeight: '600',
  },
});
