import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Avatar,
  IconButton,
  Text
} from 'react-native-paper';
import styles from './styles';
import { User } from '../../types';

type RootStackParamList = {
  VideoCallScreen: {
    channelName: string;
  };
};

function ContactScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const currentUser = auth().currentUser;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const usersRef = database().ref('users');

    const generateMockUsers = async () => {
      const mockUsers = {
        mockuser1: {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=5',
          createdAt: database.ServerValue.TIMESTAMP,
        },
        mockuser2: {
          name: 'Bob Smith',
          email: 'bob@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=11',
          createdAt: database.ServerValue.TIMESTAMP,
        },
        mockuser3: {
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=3',
          createdAt: database.ServerValue.TIMESTAMP,
        },
        mockuser4: {
          name: 'Diana Prince',
          email: 'diana@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=9',
          createdAt: database.ServerValue.TIMESTAMP,
        },
        mockuser5: {
          name: 'Edward Stark',
          email: 'edward@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=7',
          createdAt: database.ServerValue.TIMESTAMP,
        },
        mockuser6: {
          name: 'Fiona Green',
          email: 'fiona@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=13',
          createdAt: database.ServerValue.TIMESTAMP,
        },
        mockuser7: {
          name: 'George Wilson',
          email: 'george@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=15',
          createdAt: database.ServerValue.TIMESTAMP,
        },
        mockuser8: {
          name: 'Helen Miller',
          email: 'helen@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=23',
          createdAt: database.ServerValue.TIMESTAMP,
        },
        mockuser9: {
          name: 'Ian Cooper',
          email: 'ian@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=17',
          createdAt: database.ServerValue.TIMESTAMP,
        },
        mockuser10: {
          name: 'Julia Davis',
          email: 'julia@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=21',
          createdAt: database.ServerValue.TIMESTAMP,
        },
        mockuser11: {
          name: 'Kevin Parker',
          email: 'kevin@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=19',
          createdAt: database.ServerValue.TIMESTAMP,
        },
        mockuser12: {
          name: 'Laura White',
          email: 'laura@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=25',
          createdAt: database.ServerValue.TIMESTAMP,
        },
      };
      return mockUsers;
    };

    const fetchAndUploadMockUsers = async () => {
      try {
        const snapshot = await usersRef.once('value');
        const existingUsers = snapshot.val() || {};

        const mockUsers = await generateMockUsers();

        const newMockUsers = {};
        Object.entries(mockUsers).forEach(([mockId, mockUser]) => {
          const exists = Object.values(existingUsers).some(
            (existingUser: any) =>
              existingUser.email === mockUser.email ||
              existingUser.name === mockUser.name,
          );

          if (!exists) {
            // @ts-ignore
            newMockUsers[mockId] = mockUser;
          }
        });

        if (Object.keys(newMockUsers).length > 0) {
          await usersRef.update(newMockUsers);
          console.log(
            'Added new mock users:',
            Object.keys(newMockUsers).length,
          );
        }

        const updatedSnapshot = await usersRef.once('value');
        if (updatedSnapshot.exists()) {
          const usersData = updatedSnapshot.val();
          const usersList = Object.entries(usersData)
            .filter(([id]) => id !== currentUser?.uid)
            .map(([id, data]: [string, any]) => ({
              id: id,
              name: data.name,
              email: data.email,
              imageUrl: data.imageUrl,
            }));
          setUsers(usersList);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching/uploading users:', error);
        setLoading(false);
      }
    };

    fetchAndUploadMockUsers();
  }, [currentUser?.uid]);

  const renderUserItem = ({item}: {item: User}) => (
    <View style={styles.userItem}>
      <Avatar.Image
        size={50}
        source={{uri: item.imageUrl}}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
      </View>
      <View style={styles.iconContainer}>
        <IconButton icon="phone" size={24} iconColor="#420475" />
        <IconButton
          icon="video"
          size={24}
          iconColor="#420475"
          onPress={() => {
            navigation.navigate('VideoCallScreen', {
              channelName: item.name,
            });
          }}
        />
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#420475" />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
}

export default ContactScreen;
