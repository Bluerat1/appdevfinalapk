import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  const navigation = useNavigation();

  // Animation setup for fade and slide
  const fadeAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const slideAnims = [
    useRef(new Animated.Value(20)).current,
    useRef(new Animated.Value(20)).current,
    useRef(new Animated.Value(20)).current,
  ];

  useEffect(() => {
    // Staggered fade-in and slide-up animations
    Animated.stagger(
      200,
      fadeAnims.map((anim, index) =>
        Animated.parallel([
          Animated.timing(anim, {
            toValue: 1,
            duration: 500, // Increased for better visibility
            useNativeDriver: true,
          }),
          Animated.timing(slideAnims[index], {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      )
    ).start(() => console.log('HomePage animations completed'));
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Animated.View
          style={{
            opacity: fadeAnims[0],
            transform: [{ translateY: slideAnims[0] }],
          }}
        >
          <Text style={styles.mainTitle}>Power Monitor ⚡️</Text>
        </Animated.View>
        <Animated.View
          style={{
            opacity: fadeAnims[1],
            transform: [{ translateY: slideAnims[1] }],
          }}
        >
          <Text style={styles.mainSubtitle}>
            Track your energy consumption in real-time. Save money. Save the planet.
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.buttons,
            {
              opacity: fadeAnims[2],
              transform: [{ translateY: slideAnims[2] }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60, // Offset for Nav bar
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2b2d42',
    textAlign: 'center',
    marginBottom: 16,
  },
  mainSubtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#2b2d42',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4361ee',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomePage;