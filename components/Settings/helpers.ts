import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

export const HandleLogout = async (navigation: any) => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await auth().signOut();
            navigation.reset({
              index: 0,
              routes: [{name: 'Login' as never}],
            });
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ],
    {cancelable: true},
  );
};

// export const settingsItems = [
//   {
//     icon: 'account-edit',
//     title: 'Edit Profile',
//     onPress: () => navigation.navigate('EditProfile' as never),
//   },
//   {
//     icon: 'bell-outline',
//     title: 'Notifications',
//     onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
//   },
//   {
//     icon: 'shield-lock-outline',
//     title: 'Privacy',
//     onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
//   },
//   {
//     icon: 'theme-light-dark',
//     title: 'Theme',
//     onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
//   },
//   {
//     icon: 'help-circle-outline',
//     title: 'Help & Support',
//     onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
//   },
//   {
//     icon: 'information-outline',
//     title: 'About',
//     onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
//   },
//   {
//     icon: 'logout',
//     title: 'Logout',
//     onPress: HandleLogout,
//     color: '#FF3B30',
//   },
// ];
