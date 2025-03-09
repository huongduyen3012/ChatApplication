import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import {Avatar, Searchbar} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {User} from '../../types';
import {MockUsers} from './helpers';

export const NewChatScreen = ({navigation}: {navigation: any}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const currentUser = auth().currentUser;

  useEffect(() => {
    const usersRef = database().ref('users');

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
            .filter(([userId]) => userId !== currentUser?.uid)
            .map(([userId, data]: [string, any]) => ({
              id: userId,
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

  const createChat = async (selectedUser: User) => {
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
        navigation.navigate('ChatScreen', {chatId: existingChat[0]});
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
          },
          receiver: {
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
            imageUrl: selectedUser.imageUrl,
          },
        },
        messages: [],
        lastMessage: '',
        timestamp: database.ServerValue.TIMESTAMP,
        createdBy: currentUser!.uid,
        updatedAt: database.ServerValue.TIMESTAMP,
      };

      await newChatRef.set(chatData);
      navigation.navigate('ChatScreen', {chatId: newChatRef.key});
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const createGroupChat = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    if (selectedUsers.length < 2) {
      Alert.alert('Error', 'Please select at least 2 members');
      return;
    }

    try {
      const chatsRef = database().ref('chats');
      const newChatRef = chatsRef.push();

      const members = {
        [currentUser!.uid]: {
          id: currentUser!.uid,
          name: currentUser?.displayName || 'Me',
          email: currentUser?.email,
          imageUrl: currentUser?.photoURL || 'https://via.placeholder.com/50',
          role: 'admin',
        },
      };

      selectedUsers.forEach(user => {
        members[user.id] = {
          id: user.id,
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
          role: 'member',
        };
      });

      const chatData = {
        type: 'group',
        name: groupName,
        imageUrl: 'https://i.pravatar.cc/150?img=2',
        members,
        messages: [],
        lastMessage: '',
        timestamp: database.ServerValue.TIMESTAMP,
        createdBy: currentUser!.uid,
        createdAt: database.ServerValue.TIMESTAMP,
        updatedAt: database.ServerValue.TIMESTAMP,
      };

      await newChatRef.set(chatData);
      navigation.navigate('ChatScreen', {chatId: newChatRef.key});
    } catch (error) {
      console.error('Error creating group chat:', error);
    }
  };

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const renderUserItem = ({item}: {item: User}) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        isGroupChat &&
          selectedUsers.some(u => u.id === item.id) &&
          styles.selectedUserItem,
      ]}
      onPress={() =>
        isGroupChat ? toggleUserSelection(item) : createChat(item)
      }>
      <Avatar.Image
        size={50}
        source={{uri: item.imageUrl}}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      {isGroupChat && selectedUsers.some(u => u.id === item.id) && (
        <Icon source="check-circle" size={24} color="#420475" />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#420475" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.chatTypeButton, !isGroupChat && styles.activeButton]}
          onPress={() => {
            setIsGroupChat(false);
            setSelectedUsers([]);
            setGroupName('');
          }}>
          <Text style={[styles.buttonText, !isGroupChat && styles.activeText]}>
            Individual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chatTypeButton, isGroupChat && styles.activeButton]}
          onPress={() => setIsGroupChat(true)}>
          <Text style={[styles.buttonText, isGroupChat && styles.activeText]}>
            Group
          </Text>
        </TouchableOpacity>
      </View>

      {isGroupChat && (
        <View style={styles.groupNameContainer}>
          <TextInput
            style={styles.groupNameInput}
            placeholder="Enter group name"
            value={groupName}
            onChangeText={setGroupName}
          />
          <TouchableOpacity
            style={[
              styles.createGroupButton,
              (!groupName.trim() || selectedUsers.length < 2) &&
                styles.disabledButton,
            ]}
            onPress={createGroupChat}
            disabled={!groupName.trim() || selectedUsers.length < 2}>
            <Text style={styles.createGroupButtonText}>Create Group</Text>
          </TouchableOpacity>
        </View>
      )}

      <Searchbar
        placeholder="Search users..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {isGroupChat && selectedUsers.length > 0 && (
        <View style={styles.selectedUsersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedUsers.map(user => (
              <View key={user.id} style={styles.selectedUserChip}>
                <Text style={styles.selectedUserName}>{user.name}</Text>
                <TouchableOpacity onPress={() => toggleUserSelection(user)}>
                  <Icon source="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={users.filter(
          user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()),
        )}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
