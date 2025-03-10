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

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  // offlineAccess: true,
  // scopes: [
  //   'https://www.googleapis.com/auth/userinfo.profile',
  //   'https://www.googleapis.com/auth/userinfo.email',
  // ],
});

const LoginPage = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

      // Try accessing the idToken from the user object
      const idToken = signInResult.data.idToken;
      if (!idToken) {
        throw new Error('No ID token found in signInResult');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      console.log('Signed in with Google:', userCredential.user);
      Alert.alert('Success', 'Signed in with Google!');

      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };
  // const onFacebookButtonPress = async () => {
  //   try {
  //     const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  //     if (result.isCancelled) {
  //       Alert.alert('Cancelled', 'Facebook login was cancelled');
  //       return;
  //     }

  //     const data = await AccessToken.getCurrentAccessToken();
  //     if (!data) {
  //       throw new Error('Something went wrong obtaining access token');
  //     }

  //     const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  //     const userCredential = await auth().signInWithCredential(facebookCredential);

  //     console.log('Signed in with Facebook:', userCredential.user);
  //     Alert.alert('Success', 'Signed in with Facebook!');
  //     navigation.replace('MainTabs');
  //   } catch (error) {
  //     console.error('Facebook Sign-In Error:', error);
  //     Alert.alert('Error', 'Facebook Sign-In failed');
  //   }
  // };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps={'always'}
      style={{backgroundColor: 'white'}}>
      <View style={{flex: 1}}>
        <View style={styles.loginContainer}>
          <View style={[styles.logoContainer, {marginBottom: 30}]}>
            <Image
              style={[styles.logo, {width: 150, height: 150}]}
              source={require('../../assets/mainLogo.png')}
              resizeMode="contain"
            />
          </View>

          <Text
            style={[
              styles.text_header,
              {
                fontSize: 28,
                marginBottom: 25,
                textAlign: 'center',
                color: '#420475',
              },
            ]}>
            Welcome Back
          </Text>

          <View style={styles.action}>
            <Icon source="email" color="#420475" size={24} />
            <TextInput
              placeholder="Email"
              style={[
                styles.textInput,
                {
                  paddingLeft: 10,
                  color: '#333',
                },
              ]}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.action}>
            <Icon source="lock" color="#420475" size={24} />
            <TextInput
              placeholder="Password"
              style={[
                styles.textInput,
                {
                  paddingLeft: 10,
                  color: '#333',
                },
              ]}
              onChangeText={setPassword}
              value={password}
              secureTextEntry
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={{alignSelf: 'flex-end', marginBottom: 20}}>
            <Text style={{color: '#420475', fontWeight: '600'}}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.inBut,
              {
                marginTop: 20,
                marginBottom: 30,
              },
            ]}
            onPress={handleSubmit}
            disabled={loading}>
            <Text style={styles.textSign}>
              {loading ? 'Logging in...' : 'Log in'}
            </Text>
          </TouchableOpacity>

          <View style={{alignItems: 'center', marginBottom: 20}}>
            <Text style={{color: '#666', marginBottom: 20}}>
              Or continue with
            </Text>
            <View
              style={[
                styles.bottomButton,
                {
                  width: '80%',
                  justifyContent: 'space-evenly',
                },
              ]}>
              <TouchableOpacity
                style={[styles.inBut2, {backgroundColor: '#5c2089'}]}
                onPress={() => navigation.navigate('Register')}>
                <Icon source="account-plus" color="white" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.inBut2, {backgroundColor: '#db4437'}]}
                onPress={onGoogleButtonPress}>
                <Icon source="google" color="white" size={30} />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={[styles.inBut2, {backgroundColor: '#4267B2'}]}
                onPress={onFacebookButtonPress}>
                <Icon source="facebook" color="white" size={30} />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginPage;
