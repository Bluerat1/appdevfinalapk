import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, isError, message } = useSelector((state) => state.auth);

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
    if (formData.password !== formData.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
      });
      return;
    }
    if (!formData.email || !formData.password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
      });
      return;
    }
    await dispatch(register(formData));
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
      });
    } else {
      navigation.navigate('Activate');
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
          <Text style={styles.title}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={formData.first_name}
            onChangeText={(text) => setFormData({ ...formData, first_name: text })}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formData.last_name}
            onChangeText={(text) => setFormData({ ...formData, last_name: text })}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Registering...' : 'Register'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.linkText}>Already have an account? Login</Text>
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

export default RegisterPage;