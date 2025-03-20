/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
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
import {GOOGLE_WEB_CLIENT_ID} from '@env';
import theme from '../../constants/Theme';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

const LoginPage = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );

      // Check if user info exists in database
      const userSnapshot = await database()
        .ref(`users/${userCredential.user.uid}`)
        .once('value');

      if (!userSnapshot.exists()) {
        // If user info doesn't exist, create it
        await database()
          .ref(`users/${userCredential.user.uid}`)
          .set({
            name: userCredential.user.displayName || 'Anonymous',
            email: email,
            imageUrl:
              userCredential.user.photoURL || 'https://via.placeholder.com/50',
            createdAt: database.ServerValue.TIMESTAMP,
          });
      }
      Alert.alert('Success', 'Log in successfully, welcome!');
      navigation.replace('MainTabs');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Email or Password is incorrect');
    }
    setLoading(false);
  };

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      const signInResult = await GoogleSignin.signIn();

      if (!signInResult.data) {
        throw new Error('No user data found in signInResult');
      }

      const idToken = signInResult.data.idToken;
      const user = signInResult.data.user;
      if (!idToken) {
        throw new Error('No ID token found in signInResult');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      const userId = userCredential.user.uid;

      const userSnapshot = await database()
        .ref(`users/${userId}`)
        .once('value');

      if (!userSnapshot.exists()) {
        await database()
          .ref(`users/${userId}`)
          .set({
            name: user.name || userCredential.user.displayName || 'User',
            email: user.email || userCredential.user.email,
            imageUrl:
              user.imageUrl ||
              userCredential.user.photoURL ||
              'https://via.placeholder.com/50',
            phoneNumber: userCredential.user.phoneNumber || '',
            createdAt: database.ServerValue.TIMESTAMP,
          });

        console.log('Created new user record with Google data');
      } else {
        await database()
          .ref(`users/${userId}`)
          .update({
            name:
              user.name ||
              userCredential.user.displayName ||
              userSnapshot.val().name,
            email:
              user.email ||
              userCredential.user.email ||
              userSnapshot.val().email,
            imageUrl:
              user.photo ||
              userCredential.user.photoURL ||
              userSnapshot.val().imageUrl,
          });

        console.log('Updated existing user with Google data');
      }

      console.log('Signed in with Google:', userCredential.user);
      Alert.alert('Success', 'Signed in with Google!');

      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps={'always'}
      style={{backgroundColor: theme.surface}}>
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../../assets/login.png')}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.headerText}>Login to your Chat</Text>

          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon source="email" color={theme.primary} size={24} />
            </View>
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon source="lock" color={theme.primary} size={24} />
            </View>
            <TextInput
              placeholder="Password"
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
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && {opacity: 0.7}]}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Log in'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.registerButton]}
              onPress={() => navigation.navigate('Register')}>
              <Icon source="account-plus" color={theme.primary} size={26} />
              <Text style={styles.socialButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={onGoogleButtonPress}>
              <Icon source="google" color="white" size={26} />
              <Text style={styles.socialGoogleButtonText}>Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginPage;
