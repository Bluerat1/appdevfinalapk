import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NotFoundPage = () => {
  const navigation = useNavigation();

  // Animation setup
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Whoops, this place is under construction 🚧</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Go Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2b2d42',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#4361ee',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 200,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NotFoundPage;