/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Button, IconButton} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {styles} from './styles';
import {User} from '../../../types';
import theme from '../../../constants/Theme';

export function EditProfileScreen() {
  const navigation = useNavigation();
  const currentUser = auth().currentUser;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const [newProfileImageBase64, setNewProfileImageBase64] = useState<
    string | null
  >(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: 'Edit Profile',
    });

    const fetchUserData = async () => {
      if (!currentUser) {
        return;
      }

      try {
        setInitialLoading(true);

        const userRef = database().ref(`users/${currentUser.uid}`);
        const snapshot = await userRef.once('value');
        const userData = snapshot.val();

        if (userData) {
          setDisplayName(userData.name || '');
          setBio(userData.bio || '');
          setPhoneNumber(userData.phoneNumber || '');
          setProfileImage(userData.imageUrl || null);
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load profile data');
        setError('Failed to load profile data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigation]);

  const handleSelectImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
        maxWidth: 300,
        maxHeight: 300,
        includeBase64: true,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        setNewProfileImage(result.assets[0].uri);

        if (result.assets[0].base64) {
          setNewProfileImageBase64(result.assets[0].base64);
        } else {
          const base64 = await RNFS.readFile(result.assets[0].uri, 'base64');
          setNewProfileImageBase64(base64);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const userRef = database().ref(`users/${currentUser.uid}`);

      const updates: Partial<User & {bio?: string; phoneNumber?: string}> = {
        name: displayName.trim(),
        bio: bio.trim(),
        phoneNumber: phoneNumber.trim(),
      };

      if (newProfileImage && newProfileImageBase64) {
        const imageUrl = `data:image/jpeg;base64,${newProfileImageBase64}`;
        updates.imageUrl = imageUrl;

        const chatsRef = database().ref('chats');
        const chatsSnapshot = await chatsRef.once('value');

        if (chatsSnapshot.exists()) {
          chatsSnapshot.forEach(chatSnapshot => {
            const chatData = chatSnapshot.val();
            if (
              chatData.participants &&
              chatData.participants[currentUser.uid]
            ) {
              database()
                .ref(
                  `chats/${chatSnapshot.key}/participants/${currentUser.uid}/imageUrl`,
                )
                .set(imageUrl);
            }
            return undefined;
          });
        }

        await currentUser.updateProfile({
          displayName: displayName.trim(),
          // photoURL: imageUrl,
        });
      } else {
        await currentUser.updateProfile({
          displayName: displayName.trim(),
        });
      }

      await userRef.update(updates);

      setSuccess('Profile updated successfully');

      if (newProfileImage) {
        setProfileImage(newProfileImage);
        setNewProfileImage(null);
        setNewProfileImageBase64(null);
      }

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{marginTop: 16, color: theme.textSecondary}}>
          Loading profile data...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container}>
        <View style={styles.avatarContainer}>
          <View>
            <Image
              source={{
                uri:
                  newProfileImage ||
                  profileImage ||
                  'https://via.placeholder.com/120',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={handleSelectImage}>
              <IconButton icon="camera" size={16} iconColor="#fff" />
            </TouchableOpacity>
          </View>
          <Button
            mode="text"
            textColor={theme.primary}
            onPress={handleSelectImage}
            style={styles.changePhotoButton}>
            Change Profile Photo
          </Button>
        </View>

        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, {height: 80}]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={3}
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Your phone number"
              keyboardType="phone-pad"
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </View>

        <View>
          <Button
            mode="contained"
            onPress={handleSaveProfile}
            style={styles.saveButton}
            buttonColor={theme.primary}
            disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}
        {loading && (
          <ActivityIndicator
            style={styles.loading}
            size="small"
            color={theme.primary}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
