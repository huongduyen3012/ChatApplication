/* eslint-disable react-native/no-inline-styles */
import database from '@react-native-firebase/database';
import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Avatar, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../../constants/Theme';
import {User} from '../../../types';
import styles from './styles';

export const FriendProfileScreen = ({navigation}: {navigation: any}) => {
  const route = useRoute<any>();
  const {userId, initialData} = route.params;
  const [userData, setUserData] = useState<User | null>(initialData || null);
  const [loading, setLoading] = useState(initialData ? false : true);

  useEffect(() => {
    navigation.setOptions({
      title: userData?.name || 'Contact Profile',
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: '#fff',
    });

    if (!userId || (initialData && !loading)) {
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userRef = database().ref(`users/${userId}`);
        const snapshot = await userRef.once('value');

        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData({
            id: userId,
            ...data,
          });
        } else {
          Alert.alert('Error', 'User not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, initialData, navigation, loading, userData?.name]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Avatar.Icon
          size={40}
          icon="account"
          color="#fff"
          style={{backgroundColor: theme.primary}}
        />
        <Text style={{marginTop: 16, color: theme.textSecondary}}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Image
          size={120}
          source={{
            uri: userData?.imageUrl || 'https://via.placeholder.com/120',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData?.name || 'Unknown User'}</Text>

        {userData?.phoneNumber && (
          <View style={styles.phoneContainer}>
            <Icon name="phone" size={18} color="#666" />
            <Text style={styles.phoneText}>{userData.phoneNumber}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.goBack()}>
          <Icon name="message-text" size={24} color={theme.primary} />
          <Text style={styles.actionButtonText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          disabled={!userData?.phoneNumber}>
          <Icon
            name="phone"
            size={24}
            color={userData?.phoneNumber ? theme.primary : '#ccc'}
          />
          <Text
            style={[
              styles.actionButtonText,
              !userData?.phoneNumber && {color: '#ccc'},
            ]}>
            Call
          </Text>
        </TouchableOpacity>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Contact Info</Text>

        <View style={styles.detailItem}>
          <Icon name="email" size={24} color={theme.primary} />
          <Text style={styles.detailText}>{userData?.email || 'No email'}</Text>
        </View>

        {userData?.phoneNumber && (
          <View style={styles.detailItem}>
            <Icon name="phone" size={24} color={theme.primary} />
            <Text style={styles.detailText}>{userData.phoneNumber}</Text>
          </View>
        )}

        {userData?.createdAt && (
          <View style={styles.detailItem}>
            <Icon name="clock-outline" size={24} color={theme.primary} />
            <Text style={styles.detailText}>
              Joined {new Date(userData.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
