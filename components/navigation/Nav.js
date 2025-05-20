import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import Icon from 'react-native-vector-icons/Feather';

const Nav = ({ activeScreen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, userInfo } = useSelector((state) => state.auth);

  // Animation setup for mobile menu
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isMobileMenuOpen ? 0 : Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigation.navigate('Home');
    setIsMobileMenuOpen(false);
  };

  const navigateIfNotActive = (screen) => {
    if (activeScreen !== screen) {
      navigation.navigate(screen);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.navbarContainer}>
        <TouchableOpacity onPress={() => navigateIfNotActive('Home')}>
          <Text style={styles.logo}>⚡️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mobileMenuButton} onPress={toggleMobileMenu}>
          <Icon name={isMobileMenuOpen ? 'x' : 'menu'} size={24} color="#2b2d42" />
        </TouchableOpacity>

        <Animated.View style={[styles.navMenu, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.navLinks}>
            {user ? (
              <>
                <TouchableOpacity
                  style={[styles.navLink, activeScreen === 'Dashboard' && styles.navLinkActive]}
                  onPress={() => navigateIfNotActive('Dashboard')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.navLinkText}>Dashboard</Text>
                </TouchableOpacity>

                {/* START: Edit dropdown items for authenticated users here */}
                {userInfo && (
                  <View style={styles.userProfile}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>
                        {userInfo.first_name ? userInfo.first_name[0] : ''}
                      </Text>
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName} numberOfLines={1}>
                        {userInfo.first_name} {userInfo.last_name}
                      </Text>
                      <Text style={styles.userEmail} numberOfLines={1}>
                        {userInfo.email}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => navigateIfNotActive('Profile')}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={styles.dropdownItemText}>Profile Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={handleLogout}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={styles.dropdownItemText}>Logout</Text>
                    </TouchableOpacity>
                    {/* END: Add or modify dropdown items for authenticated users here */}
                  </View>
                )}
                {/* END: Edit dropdown items for authenticated users */}
              </>
            ) : (
              <>
                {/* START: Edit dropdown items for unauthenticated users here */}
                <TouchableOpacity
                  style={[styles.navLink, activeScreen === 'Login' && styles.navLinkActive]}
                  onPress={() => navigateIfNotActive('Login')}
                  hitSlop={{ }}
                >
                  <Text style={styles.navLinkText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navLink, activeScreen === 'Register' && styles.navLinkActive]}
                  onPress={() => navigateIfNotActive('Register')}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.navLinkText}>Register</Text>
                </TouchableOpacity>
                {/* END: Add or modify dropdown items for unauthenticated users here */}
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2b2d42',
  },
  mobileMenuButton: {
    padding: 8,
  },
  navMenu: {
    position: 'absolute',
    top: 60,
    right: 0,
    width: Dimensions.get('window').width * 0.75, // Responsive width

    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navLinks: {
    flex: 1,
    padding: 16,
  },
  navLink: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  navLinkActive: {
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
  },
  navLinkText: {
    fontSize: 16,
    color: '#2b2d42',
    fontWeight: '500',
  },
  userProfile: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4361ee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  userAvatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  userInfo: {
    marginBottom: 12,
    maxWidth: 180,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2b2d42',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    marginVertical: 4,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#2b2d42',
  },
});

export default Nav;