/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Divider, Searchbar, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../constants/Theme';
import {User} from '../../types';
import {MockUsers} from './helpers';
import styles from './styles';

export const NewChatScreen = ({navigation}: {navigation: any}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const currentUser = auth().currentUser;

  useEffect(() => {
    navigation.setOptions({
      title: isGroupChat ? 'Create Group Chat' : 'New Chat',
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: '#fff',
    });
  }, [isGroupChat, navigation]);

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
              phoneNumber: data.phoneNumber || '',
              bio: data.bio || '',
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
            bio: selectedUser.bio,
          },
        },
        messages: [],
        lastMessage: '',
        timestamp: database.ServerValue.TIMESTAMP,
        createdBy: currentUser!.uid,
        updatedAt: database.ServerValue.TIMESTAMP,
      };

      await newChatRef.set(chatData);
      navigation.navigate('ChatScreen', {
        chatId: newChatRef.key,
        name: selectedUser.name,
      });
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
      const currentUserData = await database()
        .ref(`users/${currentUser!.uid}`)
        .once('value');

      const userData = currentUserData.val() || {};
      const adminImageUrl =
        userData.imageUrl ||
        currentUser?.photoURL ||
        'https://via.placeholder.com/50';

      const chatsRef = database().ref('chats');
      const newChatRef = chatsRef.push();

      const members = {
        [currentUser!.uid]: {
          id: currentUser!.uid,
          name: currentUser?.displayName || 'Me',
          email: currentUser?.email,
          imageUrl: adminImageUrl,
          phoneNumber: currentUser?.phoneNumber,
          role: 'admin',
        },
      };
      console.log('members', members);
      selectedUsers.forEach(user => {
        members[user.id] = {
          id: user.id,
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
          phoneNumber: user.phoneNumber,
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
      navigation.navigate('ChatScreen', {
        chatId: newChatRef.key,
        name: groupName,
      });
    } catch (error) {
      console.error('Error creating group chat:', error);
      Alert.alert('Error', 'Failed to create group chat');
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
        source={{uri: item.imageUrl || 'https://via.placeholder.com/50'}}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      {isGroupChat && selectedUsers.some(u => u.id === item.id) && (
        <Icon name="checkmark-circle" size={24} color={theme.primary} />
      )}
    </TouchableOpacity>
  );

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
        }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{marginTop: 16, color: theme.textSecondary}}>
          Loading contacts...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isGroupChat ? (
        <>
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search users..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              inputStyle={{color: theme.text}}
              placeholderTextColor={theme.textSecondary}
              iconColor={theme.primary}
            />

            <TouchableOpacity
              style={styles.createGroupChatButton}
              onPress={() => setIsGroupChat(true)}>
              <View style={styles.createGroupButtonContent}>
                <Icon name="people" size={20} color={theme.primary} />
                <Text style={styles.createGroupChatText}>
                  Create a group chat instead
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{paddingBottom: 20}}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Icon
                  name="search"
                  size={70}
                  color={`${theme.textSecondary}80`}
                />
                <Text style={styles.emptyStateText}>
                  {searchQuery.length > 0
                    ? 'No users found matching your search'
                    : 'No contacts available'}
                </Text>
              </View>
            )}
          />
        </>
      ) : (
        <>
          <View style={styles.groupModeHeader}>
            <View style={styles.groupNameContainer}>
              <TextInput
                label="Group Name"
                placeholder="Enter a name for your group"
                style={styles.groupNameInput}
                value={groupName}
                onChangeText={setGroupName}
                placeholderTextColor={theme.textSecondary}
              />

              {selectedUsers.length > 0 && (
                <View style={styles.selectedUsersContainer}>
                  <Text style={styles.selectedUsersTitle}>
                    Selected ({selectedUsers.length}):
                  </Text>
                  <ScrollView
                    style={styles.selectedUsersScrollContainer}
                    contentContainerStyle={{flexGrow: 1}}
                    nestedScrollEnabled={true}>
                    <View style={styles.selectedUsersFlowContainer}>
                      {selectedUsers.map(user => (
                        <View key={user.id} style={styles.selectedUserChip}>
                          <Text
                            style={styles.selectedUserName}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {user.name}
                          </Text>
                          <TouchableOpacity
                            style={styles.removeUserButton}
                            onPress={() => toggleUserSelection(user)}>
                            <Icon name="close-circle" size={20} color="white" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}

              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.cancelGroupButton}
                  onPress={() => {
                    setIsGroupChat(false);
                    setSelectedUsers([]);
                    setGroupName('');
                  }}>
                  <Text style={styles.cancelGroupButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.createGroupButton,
                    (!groupName.trim() || selectedUsers.length < 2) &&
                      styles.disabledButton,
                  ]}
                  onPress={createGroupChat}
                  disabled={!groupName.trim() || selectedUsers.length < 2}>
                  <Text style={styles.createGroupButtonText}>
                    {selectedUsers.length < 2
                      ? `Need ${2 - selectedUsers.length} more`
                      : 'Create Group'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Divider style={styles.divider} />

            <Searchbar
              placeholder="Search users to add"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={[styles.searchBar, {margin: 10}]}
              inputStyle={{color: theme.text}}
              placeholderTextColor={theme.textSecondary}
              iconColor={theme.primary}
            />
          </View>

          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{paddingBottom: 20}}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Icon
                  name="search"
                  size={70}
                  color={`${theme.textSecondary}80`}
                />
                <Text style={styles.emptyStateText}>
                  {searchQuery.length > 0
                    ? 'No users found matching your search'
                    : 'No contacts available'}
                </Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};
