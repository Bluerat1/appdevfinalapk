import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordConfirm } from '../features/auth/authSlice';
import Toast from 'react-native-toast-message';

const ResetPasswordPageConfirm = () => {
  const [formData, setFormData] = useState({
    new_password: '',
    re_new_password: '',
  });

  const { new_password, re_new_password } = formData;

  const route = useRoute();
  const { uid, token } = route.params || {};
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  // Animation setup
  const fadeAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    // Staggered fade-in animations
    Animated.stagger(100, fadeAnims.map(anim => Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }))).start();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!uid || !token) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Invalid reset password link',
      });
      return;
    }

    if (!new_password || !re_new_password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in both password fields',
      });
      return;
    }

    if (new_password !== re_new_password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Passwords do not match',
      });
      return;
    }

    const userData = { uid, token, new_password, re_new_password };
    dispatch(resetPasswordConfirm(userData));
  };

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: 'error',
        text1: 'Password Reset Failed',
        text2: message,
      });
    }

    if (isSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Password Reset',
        text2: 'Your password was reset successfully.',
      });
      navigation.navigate('Home');
    }
  }, [isError, isSuccess, message, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.titleContainer, { opacity: fadeAnims[0] }]}>
        <Text style={styles.mainTitle}>Reset Password 🔒</Text>
      </Animated.View>

      {isLoading && <ActivityIndicator size="large" color="#4361ee" style={styles.spinner} />}

      <View style={styles.authForm}>
        <Animated.View style={{ opacity: fadeAnims[1] }}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#8d99ae"
            secureTextEntry
            name="new_password"
            value={new_password}
            onChangeText={(value) => handleChange('new_password', value)}
            required
          />
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnims[2] }}>
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            placeholderTextColor="#8d99ae"
            secureTextEntry
            name="re_new_password"
            value={re_new_password}
            onChangeText={(value) => handleChange('re_new_password', value)}
            required
          />
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnims[3] }}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
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
  authForm: {
    width: '100%',
    maxWidth: 400,
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

export default ResetPasswordPageConfirm;