// pages/Profile.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Profile = () => (
  <View style={styles.container}>
    <Text>Profile Settings</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f7fa',
  },
});

export default Profile;