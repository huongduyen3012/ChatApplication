/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-catch-shadow */
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  TextInput,
  Button,
  Surface,
  Text,
  HelperText,
  Portal,
  Snackbar,
  Provider,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const ForgotPasswordScreen = ({navigation}: {navigation: any}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await auth().sendPasswordResetEmail(email);
      setShowSuccessMessage(true);
      setEmail('');
    } catch (error) {
      switch (error) {
        case 'auth/user-not-found':
          setError('No user found with this email address');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address');
          break;
        default:
          setError('An error occurred. Please try again later');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>
          Reset Password
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your
          password.
        </Text>

        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          style={styles.input}
          error={!!error}
        />

        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>

        <Button
          mode="contained"
          onPress={handlePasswordReset}
          loading={loading}
          disabled={loading}
          style={styles.button}>
          Send Reset Instructions
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          Back to Login
        </Button>
      </Surface>
      <Provider>
        <Portal>
          <Snackbar
            visible={showSuccessMessage}
            onDismiss={() => setShowSuccessMessage(false)}
            duration={5000}
            action={{
              label: 'OK',
              onPress: () => setShowSuccessMessage(false),
            }}>
            Password reset instructions have been sent to your email
          </Snackbar>
        </Portal>
      </Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  surface: {
    padding: 24,
    borderRadius: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: 'gray',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 8,
  },
});

export default ForgotPasswordScreen;
