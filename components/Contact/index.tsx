/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Text,
  Divider,
  Searchbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../constants/Theme';
import {User} from '../../types';
import styles from './styles';
import {MockUsers} from '../NewChat/helpers';

type RootStackParamList = {
  VideoCallScreen: {
    channelName: string;
  };
  ChatScreen: {
    chatId: string;
    name: string;
  };
};

function ContactScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const currentUser = auth().currentUser;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const usersRef = database().ref('users');

    // const generateMockUsers = async () => {
    //   const mockUsers = {
    //     mockuser1: {
    //       name: 'Alice Johnson',
    //       email: 'alice@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=5',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //     mockuser2: {
    //       name: 'Bob Smith',
    //       email: 'bob@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=11',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //     mockuser3: {
    //       name: 'Charlie Brown',
    //       email: 'charlie@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=3',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //     mockuser4: {
    //       name: 'Diana Prince',
    //       email: 'diana@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=9',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //     mockuser5: {
    //       name: 'Edward Stark',
    //       email: 'edward@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=7',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //     mockuser6: {
    //       name: 'Fiona Green',
    //       email: 'fiona@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=13',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //     mockuser7: {
    //       name: 'George Wilson',
    //       email: 'george@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=15',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //     mockuser8: {
    //       name: 'Helen Miller',
    //       email: 'helen@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=23',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //     mockuser9: {
    //       name: 'Ian Cooper',
    //       email: 'ian@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=17',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //     mockuser10: {
    //       name: 'Julia Davis',
    //       email: 'julia@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=21',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //     mockuser11: {
    //       name: 'Kevin Parker',
    //       email: 'kevin@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=19',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //     mockuser12: {
    //       name: 'Laura White',
    //       email: 'laura@example.com',
    //       imageUrl: 'https://i.pravatar.cc/150?img=25',
    //       createdAt: database.ServerValue.TIMESTAMP,
    //     },
    //   };
    //   return mockUsers;
    // };

    const fetchAndUploadMockUsers = async () => {
      try {
        const snapshot = await usersRef.once('value');
        const existingUsers = snapshot.val() || {};

        const mockUsers = await MockUsers();

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
              phoneNumber: data.phoneNumber,
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

  const filteredUsers = useMemo(() => {
    if (!searchQuery) {
      return users;
    }
    return users.filter(
      user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [users, searchQuery]);

  const sections = useMemo(() => {
    const firstLetters = [
      ...new Set(filteredUsers.map(user => user.name.charAt(0).toUpperCase())),
    ].sort();

    return firstLetters.map(letter => ({
      title: letter,
      data: filteredUsers
        .filter(user => user.name.charAt(0).toUpperCase() === letter)
        .sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [filteredUsers]);

  const startChat = async (selectedUser: User) => {
    try {
      const chatsRef = database().ref('chats');

      const snapshot = await chatsRef.once('value');
      const chats = snapshot.val();

      const existingChat = Object.entries(chats || {}).find(
        ([_, chat]: [string, any]) => {
          const participants = chat.participants;
          if (!participants?.sender || !participants?.receiver) {
            return false;
          }

          const isCurrentUserInChat =
            participants.sender.id === currentUser!.uid ||
            participants.receiver.id === currentUser!.uid;
          const isSelectedUserInChat =
            participants.sender.id === selectedUser.id ||
            participants.receiver.id === selectedUser.id;

          return isCurrentUserInChat && isSelectedUserInChat;
        },
      );

      if (existingChat) {
        navigation.navigate('ChatScreen', {
          chatId: existingChat[0],
          name: selectedUser.name,
        });
        return;
      }

      const newChatRef = chatsRef.push();
      const chatData = {
        participants: {
          sender: {
            id: currentUser!.uid,
            name: currentUser?.displayName || 'Me',
            email: currentUser?.email,
            imageUrl: currentUser?.photoURL || 'https://via.placeholder.com/50',
            phoneNumber: currentUser?.phoneNumber,
          },
          receiver: {
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
            imageUrl: selectedUser.imageUrl,
            phoneNumber: selectedUser.phoneNumber,
          },
        },
        messages: [],
        lastMessage: '',
        timestamp: database.ServerValue.TIMESTAMP,
        createdBy: currentUser!.uid,
        updatedAt: database.ServerValue.TIMESTAMP,
      };

      await newChatRef.set(chatData);
      await newChatRef.set(chatData);
      if (newChatRef.key) {
        navigation.navigate('ChatScreen', {
          chatId: newChatRef.key,
          name: selectedUser.name,
        });
      } else {
        Alert.alert('Error', 'Failed to create chat reference');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      Alert.alert('Error', 'Failed to start chat');
    }
  };

  const renderUserItem = ({item}: {item: User}) => (
    <TouchableOpacity style={styles.userItem} onPress={() => startChat(item)}>
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={50}
          source={{uri: item.imageUrl}}
          style={styles.avatar}
        />
        <View style={extendedStyles.userInitial}>
          <Text style={extendedStyles.initialText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.userInfo}>
        <Text style={extendedStyles.userName}>{item.name}</Text>
        <Text style={extendedStyles.userEmail}>{item.phoneNumber}</Text>
      </View>
      <Icon name="message-text" size={24} color={theme.primary} />
    </TouchableOpacity>
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: {title: string; data: User[]};
  }) => (
    <View style={extendedStyles.sectionHeader}>
      <Text style={extendedStyles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  const renderEmptyList = () => (
    <View style={extendedStyles.emptyContainer}>
      <Icon
        name="account-search"
        size={70}
        color={`${theme.textSecondary}80`}
      />
      <Text style={extendedStyles.emptyText}>
        {searchQuery
          ? 'No contacts match your search'
          : 'No contacts available'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{marginTop: 16, color: theme.textSecondary}}>
          Loading contacts...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={extendedStyles.searchContainer}>
        <Searchbar
          placeholder="Search contacts"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={extendedStyles.searchBar}
        />
      </View>

      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          renderItem={renderUserItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => (
            <Divider style={extendedStyles.divider} />
          )}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={extendedStyles.listContent}
        />
      ) : (
        renderEmptyList()
      )}
    </View>
  );
}

// Extended styles for enhanced UI
const extendedStyles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  searchBar: {
    elevation: 2,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    height: 48,
  },
  sectionHeader: {
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: `${theme.primary}10`,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: `${theme.primary}30`,
  },
  sectionHeaderText: {
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#e0e0e0',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  userInitial: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -4,
    bottom: -4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  initialText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default ContactScreen;
