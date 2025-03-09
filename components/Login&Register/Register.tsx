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

      // Create user data in the database
      await database().ref(`/users/${userId}`).set({
        username,
        email,
        imageUrl: 'https://i.pravatar.cc/150?img=05',
        createdAt: new Date().toISOString(),
      });

      // Update user profile
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
      style={{backgroundColor: 'white'}}>
      <View>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/signUp.png')}
          />
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>Register</Text>

          <View style={styles.action}>
            <Icon source="account" color="#420475" size={24} />
            <TextInput
              placeholder="Enter Username"
              style={styles.textInput}
              onChangeText={setUsername}
              value={username}
            />
            {username.length > 0 && (
              <Icon
                source={username.length >= 3 ? 'check-circle' : 'close-circle'}
                color={username.length >= 3 ? '#00C853' : '#FF3B30'}
                size={24}
              />
            )}
          </View>
          {username.length > 0 && username.length < 3 && (
            <Text style={{marginLeft: 10, color: 'red'}}>
              Username must be at least 3 characters
            </Text>
          )}

          <View style={styles.action}>
            <Icon source="email" color="#420475" size={24} />
            <TextInput
              placeholder="Enter Email"
              style={styles.textInput}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {email.length > 0 && (
              <Icon
                source={isValidEmail(email) ? 'check-circle' : 'close-circle'}
                color={isValidEmail(email) ? '#00C853' : '#FF3B30'}
                size={24}
              />
            )}
          </View>
          {!isValidEmail(email) && email.length > 0 && (
            <Text style={{marginLeft: 20, color: 'red'}}>
              Enter a valid email
            </Text>
          )}

          <View style={styles.action}>
            <Icon source="lock" color="#420475" size={24} />
            <TextInput
              placeholder="Enter Password"
              style={styles.textInput}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={!showPassword}
            />
            {password.length > 0 && (
              <Icon
                source={
                  isValidPassword(password) ? 'check-circle' : 'close-circle'
                }
                color={isValidPassword(password) ? '#00C853' : '#FF3B30'}
                size={24}
              />
            )}
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                source={showPassword ? 'eye' : 'eye-off'}
                color="#420475"
                size={23}
              />
            </TouchableOpacity>
          </View>
          {!isValidPassword(password) && password.length > 0 && (
            <Text style={{marginLeft: 20, color: 'red'}}>
              Password must contain uppercase, lowercase, number, and be 6+
              characters long
            </Text>
          )}
        </View>

        <View style={styles.button}>
          <TouchableOpacity
            style={styles.inBut}
            onPress={handleSubmit}
            disabled={loading}>
            <View>
              <Text style={styles.textSign}>
                {loading ? 'Registering...' : 'Register'}
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
            <Text style={{color: '#666'}}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{color: '#420475', fontWeight: '600'}}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
