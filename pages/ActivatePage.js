import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { activate, reset } from '../features/auth/authSlice';
import Toast from 'react-native-toast-message';

const ActivatePage = () => {
  const route = useRoute();
  const { uid, token } = route.params || {};
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

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

  const handleSubmit = () => {
    if (!uid || !token) {
      Toast.show({
        type: 'error',
        text1: 'Activation Failed',
        text2: 'Invalid activation link',
      });
      return;
    }

    const userData = { uid, token };
    dispatch(activate(userData));
  };

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Activation Failed',
        text2: message,
      });
    }

    if (isSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Activation Successful',
        text2: 'Your account has been activated! You can login now',
      });
      navigation.navigate('Login');
    }

    dispatch(reset());
  }, [isError, isSuccess, navigation, dispatch]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.titleContainer, { opacity: fadeAnim }]}>
        <Text style={styles.mainTitle}>Activate Account ✅</Text>
      </Animated.View>

      {isLoading && <ActivityIndicator size="large" color="#4361ee" style={styles.spinner} />}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Activate Account</Text>
      </TouchableOpacity>
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
  titleContainer: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2b2d42',
  },
  button: {
    backgroundColor: '#00b4d8',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
    maxWidth: 400,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  spinner: {
    marginVertical: 16,
  },
});

export default ActivatePage;