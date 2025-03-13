import {StyleSheet} from 'react-native';
import theme from '../../../constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.border,
    // backgroundColor: theme.background,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.primary,
    borderRadius: 20,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    // Add subtle shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  changePhotoButton: {
    marginTop: 10,
  },

  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: theme.text,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: theme.surface,
    color: theme.text,
  },

  saveButton: {
    backgroundColor: theme.primary,
    paddingVertical: 8,
    borderRadius: 12,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loading: {
    marginVertical: 10,
  },
  errorText: {
    color: theme.error,
    textAlign: 'center',
    marginVertical: 10,
  },
  successText: {
    color: theme.success,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '500',
  },
});
