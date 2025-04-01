import { StyleSheet } from 'react-native';

// Color palette
export const COLORS = {
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  background: {
    primary: '#121212',
    secondary: '#1f2937',
    tertiary: '#2d3748',
  },
  text: {
    primary: '#e0e0e0',
    secondary: '#a0aec0',
    muted: '#6b7280',
  },
  border: '#374151',
  success: '#15803d',
  warning: '#a16207',
  error: '#b91c1c',
  info: '#1e40af',
};

// Consistent shadow style
export const shadow = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
};

// Common text styles
export const typography = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.text.secondary,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text.secondary,
  },
  label: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
});

// Layout styles
export const layout = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  card: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...shadow.small,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#3d4852',
  },
});

// Button styles
export const buttons = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: COLORS.background.tertiary,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Test area styles
export const testArea = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 20,
    ...shadow.large,
  },
  active: {
    backgroundColor: COLORS.background.secondary,
  },
  completed: {
    backgroundColor: '#242424',
  },
});

// Results card styles
export const resultsCard = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 24,
    ...shadow.small,
  },
});
