import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { store } from './app/store';
import Nav from './components/navigation/Nav';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ResetPasswordPageConfirm from './pages/ResetPasswordPageConfirm';
import ActivatePage from './pages/ActivatePage';
import NotFoundPage from './pages/NotFoundPage';
import Profile from './pages/Profile';
import ProtectedRoute from './components/routing/ProtectedRoute';
import { loadAuthState, setAuthState } from './features/auth/authSlice';
import Toast, { BaseToast } from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

// Debug imports
console.log('Dashboard import:', Dashboard, typeof Dashboard);
console.log('Profile import:', Profile, typeof Profile);
console.log('React import:', React, typeof React);

// Wrappers for ProtectedRoute
const DashboardProtected = () => {
  console.log('DashboardProtected rendering with:', Dashboard);
  return <ProtectedRoute component={Dashboard} />;
};
const ProfileProtected = () => {
  console.log('ProfileProtected rendering with:', Profile);
  return <ProtectedRoute component={Profile} />;
};

const App = () => {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [activeScreen, setActiveScreen] = useState('Home');
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const authState = await loadAuthState();
      dispatch(setAuthState(authState));
      setIsAuthLoaded(true);
    };
    initializeAuth();
  }, [dispatch]);

  if (!isAuthLoaded) {
    return null;
  }

  return (
    <NavigationContainer
      onStateChange={(state) => {
        const route = state.routes[state.index];
        console.log('Navigation state changed to:', route.name);
        setActiveScreen(route.name);
      }}
    >
      <View style={styles.container}>
        <Nav activeScreen={activeScreen} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animationEnabled: true,
            animation: 'fade',
            animationDuration: 300,
            gestureEnabled: false, // Disable swipe-to-go-back gesture
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomePage}
            listeners={{
              transitionStart: () => console.log('Transition started for Home'),
              transitionEnd: () => console.log('Transition ended for Home'),
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginPage}
            listeners={{
              transitionStart: () => console.log('Transition started for Login'),
              transitionEnd: () => console.log('Transition ended for Login'),
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterPage}
            listeners={{
              transitionStart: () => console.log('Transition started for Register'),
              transitionEnd: () => console.log('Transition ended for Register'),
            }}
          />
          <Stack.Screen name="Activate" component={ActivatePage} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordPage} />
          <Stack.Screen name="ResetPasswordConfirm" component={ResetPasswordPageConfirm} />
          <Stack.Screen name="Dashboard" component={DashboardProtected} />
          <Stack.Screen name="Profile" component={ProfileProtected} />
          <Stack.Screen name="NotFound" component={NotFoundPage} />
        </Stack.Navigator>
        <Toast
          topOffset={70}
          zIndex={2000}
          config={{
            error: (props) => (
              <BaseToast
                {...props}
                style={{ borderLeftColor: '#ef4444' }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{ fontSize: 16 }}
                text2Style={{ fontSize: 14 }}
              />
            ),
          }}
        />
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
};

const AppWrapper = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
});

export default AppWrapper;