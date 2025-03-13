import React from 'react';
import {Alert, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {HandleLogout} from './helpers';
import styles from './styles';
import theme from '../../constants/Theme';

export function SettingsScreen({navigation}: any) {
  const accountSettings = [
    {
      icon: 'account-edit',
      title: 'Edit Profile',
      onPress: () => navigation.navigate('EditProfile'),
      iconBackground: `${theme.primary}15`,
    },
    {
      icon: 'bell-outline',
      title: 'Notifications',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
      iconBackground: `${theme.info}15`,
    },
    {
      icon: 'shield-lock-outline',
      title: 'Privacy',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
      iconBackground: `${theme.secondary}15`,
    },
  ];

  const appSettings = [
    {
      icon: 'theme-light-dark',
      title: 'Theme',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
      iconBackground: `${theme.accent}15`,
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
      iconBackground: `${theme.success}15`,
    },
    {
      icon: 'information-outline',
      title: 'About',
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
      iconBackground: `${theme.info}15`,
    },
  ];

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.settingItem}
      onPress={item.onPress}>
      <View
        style={[
          styles.iconContainer,
          {backgroundColor: item.iconBackground || 'transparent'},
        ]}>
        <Icon name={item.icon} size={24} color={item.color || theme.primary} />
      </View>
      <Text style={[styles.settingItemText, item.color && {color: item.color}]}>
        {item.title}
      </Text>
      <Icon
        name="chevron-right"
        size={20}
        color={theme.textSecondary}
        style={styles.settingItemArrow}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Account</Text>
      {accountSettings.map(renderSettingItem)}

      <Text style={styles.sectionTitle}>App</Text>
      {appSettings.map(renderSettingItem)}

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => HandleLogout(navigation)}>
        <View
          style={[styles.iconContainer, {backgroundColor: `${theme.error}15`}]}>
          <Icon name="logout" size={24} color={theme.error} />
        </View>
        <Text style={[styles.settingItemText, {color: theme.error}]}>
          Logout
        </Text>
        <Icon
          name="chevron-right"
          size={20}
          color={theme.error}
          style={styles.settingItemArrow}
        />
      </TouchableOpacity>
    </ScrollView>
  );
}
