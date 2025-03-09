import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {HandleLogout} from './helpers';
import styles from './styles';

export function SettingsScreen() {
  const navigation = useNavigation();

  const settingsItems = [
    {
      icon: 'account-edit',
      title: 'Edit Profile',
      onPress: () => navigation.navigate('EditProfile' as never),
    },
    {
      icon: 'bell-outline',
      title: 'Notifications',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      icon: 'shield-lock-outline',
      title: 'Privacy',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      icon: 'theme-light-dark',
      title: 'Theme',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      icon: 'information-outline',
      title: 'About',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      icon: 'logout',
      title: 'Logout',
      onPress: () => HandleLogout(navigation),
      color: '#FF3B30',
    },
  ];

  return (
    <View style={styles.container}>
      {settingsItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.settingItem}
          onPress={item.onPress}>
          <Icon name={item.icon} size={24} color={item.color || '#666'} />
          <Text
            style={[styles.settingItemText, item.color && {color: item.color}]}>
            {item.title}
          </Text>
          <Icon
            name="chevron-right"
            size={24}
            color={item.color || '#666'}
            style={styles.settingItemArrow}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
