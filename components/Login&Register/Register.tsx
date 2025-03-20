/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, {useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-paper';
import styles from './styles';
import theme from '../../constants/Theme';

export const RegisterScreen = ({navigation}: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);

  const isValidPassword = (password: string) =>
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password);

  const isValidPhone = (phone: string) => /^\+?[0-9]{10,15}$/.test(phone);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
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

    if (phoneNumber && !isValidPhone(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const userId = userCredential.user.uid;

      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name,
      )}&background=random&color=fff&size=200`;

      await userCredential.user.updateProfile({
        displayName: name,
        photoURL: avatarUrl,
      });

      await database().ref(`/users/${userId}`).set({
        name,
        email,
        phoneNumber: phoneNumber.trim(),
        imageUrl: avatarUrl,
        createdAt: new Date().toISOString(),
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
            source={require('../../assets/sign-up.png')}
          />
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.headerText}>Create Account</Text>

          <View style={styles.inputContainer}>
            <Icon source="account" color={theme.primary} size={24} />
            <TextInput
              placeholder="Enter Username"
              style={styles.textInput}
              onChangeText={setName}
              value={name}
              placeholderTextColor={theme.textSecondary}
            />
            {name.length > 0 && (
              <Icon
                source={name.length >= 3 ? 'check-circle' : 'close-circle'}
                color={name.length >= 3 ? theme.success : theme.error}
                size={24}
              />
            )}
          </View>
          {name.length > 0 && name.length < 3 && (
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
            <Text style={styles.errorText}>Enter a valid email address</Text>
          )}
          <View style={styles.inputContainer}>
            <Icon source="phone" color={theme.primary} size={24} />
            <TextInput
              placeholder="Enter Phone Number (optional)"
              style={styles.textInput}
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              keyboardType="phone-pad"
              placeholderTextColor={theme.textSecondary}
            />
            {phoneNumber.length > 0 && (
              <Icon
                source={
                  isValidPhone(phoneNumber) ? 'check-circle' : 'close-circle'
                }
                color={isValidPhone(phoneNumber) ? theme.success : theme.error}
                size={24}
              />
            )}
          </View>
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
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                source={showPassword ? 'eye' : 'eye-off'}
                color={theme.primary}
                size={23}
              />
            </TouchableOpacity>
            {password.length > 0 && (
              <Icon
                source={
                  isValidPassword(password) ? 'check-circle' : 'close-circle'
                }
                color={isValidPassword(password) ? theme.success : theme.error}
                size={24}
              />
            )}
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
            style={[styles.input, loading && styles.disabledButton]}
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
