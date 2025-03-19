/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import auth from '@react-native-firebase/auth';
import database, {DataSnapshot} from '@react-native-firebase/database';
import {useEffect, useState} from 'react';
import {Alert, FlatList, Text, View} from 'react-native';
import {Avatar, IconButton, Modal, Portal, Searchbar} from 'react-native-paper';
import {ChatParticipant, User} from '../../../types';
import {styles} from './styles';
import theme from '../../../constants/Theme';

export const AddMemberModal = ({
  chatId,
  participants,
  isVisible,
  onDismiss,
}: {
  chatId: string;
  participants: Record<string, ChatParticipant>;
  isVisible: boolean;
  onDismiss: () => void;
}) => {
  const [searchResults, setSearchResults] = useState<Array<User>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<Array<User>>([]);
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (isVisible) {
      const availableUsers = allUsers.filter(user => !participants[user.id]);
      setSearchResults(availableUsers);
    }
  }, [isVisible, participants, allUsers]);

  useEffect(() => {
    // if (isVisible) {
    //   const availableUsers = allUsers.filter(user => !participants[user.id]);
    //   setSearchResults(availableUsers);
    // }
    const loadUsers = async () => {
      try {
        const usersRef = database().ref('users');
        const snapshot = await usersRef.once('value');

        const usersList: Array<any> = [];
        snapshot.forEach((child: DataSnapshot) => {
          if (child.key !== currentUser?.uid) {
            usersList.push({
              id: child.key,
              ...child.val(),
            });
          }
          return undefined;
        });

        setAllUsers(usersList);
        const availableUsers = usersList.filter(user => !participants[user.id]);
        setSearchResults(availableUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        Alert.alert('Error', 'Failed to load users. Please try again.');
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      const availableUsers = allUsers.filter(user => !participants[user.id]);
      setSearchResults(availableUsers);
    } else {
      const filteredUsers = allUsers.filter(
        user =>
          !participants[user.id] &&
          (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())),
      );
      setSearchResults(filteredUsers);
    }
  }, [searchQuery, allUsers, participants]);

  const addMember = async (userId: string, userInfo: any) => {
    try {
      const memberRef = database().ref(`chats/${chatId}/members/${userId}`);
      const memberSnapshot = await memberRef.once('value');

      if (memberSnapshot.exists()) {
        Alert.alert(
          'Already a Member',
          `${userInfo.name} is already in this group.`,
        );
        return;
      }

      await database().ref(`chats/${chatId}/members/${userId}`).set({
        name: userInfo.name,
        email: userInfo.email,
        imageUrl: userInfo.imageUrl,
        isAdmin: false,
      });

      const messagesRef = database().ref(`messages/${chatId}`);
      const systemMessageRef = messagesRef.push();
      await systemMessageRef.set({
        content: `${userInfo.name} has joined the chat`,
        createdAt: database.ServerValue.TIMESTAMP,
        system: true,
        user: {
          _id: 'system',
          name: 'System',
          imageUrl: '',
        },
      });

      setSearchResults(prev => prev.filter(user => user.id !== userId));
      Alert.alert('Success', `${userInfo.name} has been added to the chat`);
    } catch (error) {
      console.error('Error adding member:', error);
      Alert.alert('Error', 'Failed to add member. Please try again.');
    }
  };

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Members</Text>
          <IconButton icon="close" size={24} onPress={onDismiss} />
        </View>

        <Searchbar
          placeholder="Search users..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          style={styles.userList}
          renderItem={({item}) => (
            <View style={styles.userItem}>
              <Avatar.Image
                size={40}
                source={{
                  uri: item.imageUrl || 'https://via.placeholder.com/40',
                }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
              <IconButton
                icon="account-plus"
                iconColor={theme.primary}
                size={24}
                onPress={() => addMember(item.id, item)}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? 'No matching users found'
                  : 'No users available to add'}
              </Text>
            </View>
          }
        />
      </Modal>
    </Portal>
  );
};
