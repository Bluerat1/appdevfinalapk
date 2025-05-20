import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useSelector((state) => state.auth);
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) {
      console.log('Navigating to Home due to no user');
      navigation.navigate('Home');
    }
  }, [user, navigation]);

  if (!user) {
    return null;
  }

  if (!Component || typeof Component !== 'function') {
    console.error('ProtectedRoute: Invalid or no component provided:', Component);
    return null;
  }

  console.log('Rendering component:', Component.name || 'Unnamed Component');
  return <Component />;
};

export default ProtectedRoute;