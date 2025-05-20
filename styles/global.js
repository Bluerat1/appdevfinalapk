import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    width: '75%', // --container-width-lg
    marginHorizontal: 'auto',
  },
  textLight: {
    color: '#8d99ae', // --color-text-light
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    fontSize: 16, // Approximate 0.95rem
    fontWeight: '500',
    textAlign: 'center',
    borderRadius: 6, // --border-radius-sm
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  btnPrimary: {
    backgroundColor: '#4361ee', // --color-primary
    color: '#ffffff', // --color-white
  },
  btnSecondary: {
    backgroundColor: '#ffffff',
    borderColor: '#4361ee',
    borderWidth: 1,
    color: '#4361ee',
  },
  btnAccent: {
    backgroundColor: '#f72585', // --color-accent
    color: '#ffffff',
  },
});