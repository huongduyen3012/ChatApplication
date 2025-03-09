import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';
import { BaseUser } from '../../types';

export function UserProfileScreen() {
  const [userData, setUserData] = useState<BaseUser | null>(null);
  const navigation = useNavigation();
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (currentUser) {
      const userRef = database().ref(`users/${currentUser.uid}`);
      userRef.once('value').then(snapshot => {
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      });
    }
  }, [currentUser]);

  const menuItems = [
    {
      icon: 'cog-outline',
      title: 'Settings',
      onPress: () => navigation.navigate('Settings' as never),
    },
    {
      icon: 'account-group-outline',
      title: 'Friends',
      onPress: () => navigation.navigate('Friends' as never),
    },
    {
      icon: 'image-multiple-outline',
      title: 'Media & Files',
      onPress: () => navigation.navigate('Media' as never),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity
          style={styles.editAvatarContainer}
          onPress={() => navigation.navigate('EditProfile' as never)}>
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

      <View style={styles.section}>
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
