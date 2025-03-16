import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, {useEffect, useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BaseUser} from '../../types';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';

export function UserProfileScreen(props: any) {
  const [userData, setUserData] = useState<BaseUser | null>(null);
  const currentUser = auth().currentUser;
  const navigationHook = useNavigation();
  const navigation = props?.navigation || navigationHook;

  useEffect(() => {
    if (currentUser) {
      const userRef = database().ref(`users/${currentUser.uid}`);
      const onValueChange = userRef.on('value', snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('User data updated:', data);
          setUserData(data);
        }
      });

      return () => {
        userRef.off('value', onValueChange);
      };
    }
  }, [currentUser]);

  const menuItems = [
    {
      icon: 'cog-outline',
      title: 'Settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'account-group-outline',
      title: 'Friends',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      icon: 'image-multiple-outline',
      title: 'Media & Files',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      icon: 'test-tube-empty',
      title: 'Test Lazy Loading',
      onPress: () => navigation.navigate('LazyLoadingTest'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          style={styles.editAvatarContainer}
          onPress={() => navigation.navigate('EditProfile')}>
          <Image
            source={{
              uri: userData?.imageUrl || 'https://via.placeholder.com/120',
            }}
            style={styles.avatar}
          />
          <View style={styles.editIconContainer}>
            <Icon name="pencil" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{userData?.name || 'Loading...'}</Text>
        <Text style={styles.email}>{userData?.email || ''}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>152</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>15</Text>
          <Text style={styles.statLabel}>Groups</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>284</Text>
          <Text style={styles.statLabel}>Messages</Text>
        </View>
      </View>

      <View>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}>
            <Icon name={item.icon} size={24} color="#666" />
            <Text style={styles.menuItemText}>{item.title}</Text>
            <Icon
              name="chevron-right"
              size={24}
              color="#666"
              style={styles.menuItemArrow}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
