import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  // Animation setup
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onSubmit = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
      });
      return;
    }
    const userData = { email, password };
    await dispatch(login(userData));
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    } else if (user) {
      navigation.navigate('Dashboard');
    }
    dispatch(reset());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.linkText}>Don’t have an account? Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2b2d42',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#4361ee',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 12,
    alignItems: 'center',
  },
  linkText: {
    color: '#4361ee',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginPage;