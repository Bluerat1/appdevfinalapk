import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../features/auth/authSlice';
import Toast from 'react-native-toast-message';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  // Animation setup
  const fadeAnims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    // Staggered fade-in animations
    Animated.stagger(100, fadeAnims.map(anim => Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }))).start();
  }, []);

  const handleChange = (value) => {
    setFormData({ email: value });
  };

  const handleSubmit = () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter an email address',
      });
      return;
    }

    const userData = { email };
    dispatch(resetPassword(userData));
  };

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Reset Password Failed',
        text2: message,
      });
    }

    if (isSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Reset Password',
        text2: 'A reset password email has been sent to you.',
      });
      navigation.navigate('Home');
    }
  }, [isError, isSuccess, message, navigation]);

  return (
    
    <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
        <Animated.View style={[styles.titleContainer, { opacity: fadeAnims[0] }]}>
            <Text style={styles.mainTitle}>Reset Password 🔑</Text>
        </Animated.View>

        {isLoading && <ActivityIndicator size="large" color="#4361ee" style={styles.spinner} />}

        <View style={styles.authForm}>
            <Animated.View style={{ opacity: fadeAnims[1] }}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#8d99ae"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={handleChange}
                required
            />
            </Animated.View>
            <Animated.View style={{ opacity: fadeAnims[2] }}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Reset Password</Text>
            </TouchableOpacity>
            </Animated.View>
        </View>
        </View>
    </ScrollView>
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
    scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 0,
  },
  titleContainer: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2b2d42',
  },
  authForm: {
    width: '100%',
    maxWidth: 400,
  },
 content:{
    paddingTop: 60, // Offset for Nav bar
    paddingBottom: 20,
 },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    fontSize: 16,
    color: '#2b2d42',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  button: {
    backgroundColor: '#4361ee',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
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

export default ResetPasswordPage;