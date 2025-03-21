/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-catch-shadow */
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Text, HelperText, Portal, Snackbar, Provider, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import theme from '../../../constants/Theme';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmail = (email: string) => {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0) {
      setIsValidEmail(validateEmail(text));
    } else {
      setIsValidEmail(true);
    }
    setError('');
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await auth().sendPasswordResetEmail(email);
      setShowSuccessMessage(true);
      setEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            setError('No user found with this email address');
            break;
          case 'auth/invalid-email':
            setError('Please enter a valid email address');
            break;
          default:
            setError('An error occurred. Please try again later');
        }
      } else {
        setError('An error occurred. Please try again later');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Forgot password?</Text>
              <Text style={styles.subtitle}>
                No worries, we'll send you instructions to reset your password.
              </Text>

              <View style={styles.inputContainer}>
                <Icon name="email" size={24} color={theme.primary} />
                <TextInput
                  placeholder="Enter Email"
                  style={styles.textInput}
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={theme.textSecondary}
                  error={!!error || !isValidEmail}
                />
                {email.length > 0 && (
                  <Icon
                    name={isValidEmail ? 'check-circle' : 'close-circle'}
                    color={isValidEmail ? theme.success : theme.error}
                    size={24}
                  />
                )}
              </View>

              {error ? (
                <HelperText
                  type="error"
                  visible={!!error}
                  style={styles.errorText}>
                  {error}
                </HelperText>
              ) : (
                !isValidEmail &&
                email.length > 0 && (
                  <Text style={styles.errorText}>
                    Please enter a valid email address
                  </Text>
                )
              )}

              <TouchableOpacity
                style={[
                  styles.resetButton,
                  (loading || !email || !isValidEmail) && styles.disabledButton,
                ]}
                onPress={handlePasswordReset}
                disabled={loading || !email || !isValidEmail}>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.buttonText}>Sending...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Send Reset Instructions</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Portal>
          <Snackbar
            visible={showSuccessMessage}
            onDismiss={() => setShowSuccessMessage(false)}
            duration={5000}
            style={styles.snackbar}
            action={{
              label: 'OK',
              onPress: () => setShowSuccessMessage(false),
            }}>
            Password reset instructions have been sent to your email
          </Snackbar>
        </Portal>
      </KeyboardAvoidingView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.primary,
  },

  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    padding: 10,
    height: 50,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  errorText: {
    color: theme.error,
    fontSize: 14,
    marginBottom: 12,
    marginTop: -8,
  },
  resetButton: {
    backgroundColor: theme.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: `${theme.primary}80`,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snackbar: {
    backgroundColor: theme.success,
  },
});

export default ForgotPasswordScreen;
