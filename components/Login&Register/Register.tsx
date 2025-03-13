/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from 'react-native-paper';
import styles from './styles';
import theme from '../../constants/Theme';

export const RegisterScreen = ({navigation}: any) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);

  const isValidPassword = (password: string) =>
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password);

  const handleSubmit = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Enter a valid email address');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert(
        'Error',
        'Password must contain at least 6 characters, including uppercase, lowercase, and a number',
      );
      return;
    }

    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      await database().ref(`/users/${userId}`).set({
        username,
        email,
        imageUrl: 'https://i.pravatar.cc/150?img=05',
        createdAt: new Date().toISOString(),
      });

      await userCredential.user.updateProfile({
        displayName: username,
      });

      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Login');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Registration Failed', error.message);
    }
    setLoading(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'always'}
      style={styles.container}>
      <View>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/signUp.png')}
          />
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.headerText}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Icon source="account" color={theme.primary} size={24} />
            <TextInput
              placeholder="Enter Username"
              style={styles.textInput}
              onChangeText={setUsername}
              value={username}
              placeholderTextColor={theme.textSecondary}
            />
            {username.length > 0 && (
              <Icon
                source={username.length >= 3 ? 'check-circle' : 'close-circle'}
                color={username.length >= 3 ? theme.success : theme.error}
                size={24}
              />
            )}
          </View>
          {username.length > 0 && username.length < 3 && (
            <Text style={styles.errorText}>
              Username must be at least 3 characters
            </Text>
          )}

          <View style={styles.inputContainer}>
            <Icon source="email" color={theme.primary} size={24} />
            <TextInput
              placeholder="Enter Email"
              style={styles.textInput}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.textSecondary}
            />
            {email.length > 0 && (
              <Icon
                source={isValidEmail(email) ? 'check-circle' : 'close-circle'}
                color={isValidEmail(email) ? theme.success : theme.error}
                size={24}
              />
            )}
          </View>
          {!isValidEmail(email) && email.length > 0 && (
            <Text style={styles.errorText}>
              Enter a valid email address
            </Text>
          )}

          <View style={styles.inputContainer}>
            <Icon source="lock" color={theme.primary} size={24} />
            <TextInput
              placeholder="Enter Password"
              style={styles.textInput}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!showPassword}
              placeholderTextColor={theme.textSecondary}
            />
            {password.length > 0 && (
              <Icon
                source={
                  isValidPassword(password) ? 'check-circle' : 'close-circle'
                }
                color={isValidPassword(password) ? theme.success : theme.error}
                size={24}
              />
            )}
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                source={showPassword ? 'eye' : 'eye-off'}
                color={theme.primary}
                size={23}
              />
            </TouchableOpacity>
          </View>
          {!isValidPassword(password) && password.length > 0 && (
            <Text style={styles.errorText}>
              Password must contain uppercase, lowercase, number, and be 6+
              characters long
            </Text>
          )}
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            style={[
              styles.inBut, 
              loading && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.textSign}>
              {loading ? 'Registering...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.linkTextContainer}>
            <Text style={styles.normalText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
