/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {useEffect, useState} from 'react';
import database, {DataSnapshot} from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Alert, FlatList, SafeAreaView, Text, View} from 'react-native';
import {Avatar, IconButton, Modal, Portal, Provider} from 'react-native-paper';
import styles from '../styles';
import {ChatParticipant, User} from '../../../types';

export const AddMemberModal = ({
  chatId,
  participants,
}: {
  chatId: string;
  participants: Record<string, ChatParticipant>;
}) => {
  const [isAddMemberVisible, setIsAddMemberVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<User>>([]);
  const [allUsers, setAllUsers] = useState<Array<User>>([]);
  const currentUser = auth().currentUser;

  useEffect(() => {
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
      } catch (error) {
        console.error('Error loading users:', error);
        Alert.alert('Error', 'Failed to load users. Please try again.');
      }
    };

    loadUsers();
  }, []);

  const addMember = async (userId: string, userInfo: any) => {
    try {
      await database().ref(`chats/${chatId}/participants/${userId}`).set({
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

      setIsAddMemberVisible(false);
      Alert.alert('Success', `${userInfo.name} has been added to the chat`);
    } catch (error) {
      console.error('Error adding member:', error);
      Alert.alert('Error', 'Failed to add member. Please try again.');
    }
  };

  useEffect(() => {
    if (isAddMemberVisible) {
      const availableUsers = allUsers.filter(user => !participants[user.id]);
      setSearchResults(availableUsers);
    }
  }, [isAddMemberVisible, participants, allUsers]);
  return (
    <Provider>
      <SafeAreaView>
        <Portal>
          <Modal
            visible={isAddMemberVisible}
            onDismiss={() => setIsAddMemberVisible(false)}>
            <View style={styles.modalContainer}>
              <Text
                style={{fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>
                Add Members
              </Text>
              <FlatList
                data={searchResults}
                keyExtractor={item => item.id}
                style={{maxHeight: 300}}
                renderItem={({item}) => (
                  <View style={styles.searchResultItem}>
                    <Avatar.Image
                      size={40}
                      source={{
                        uri: item.imageUrl || 'https://via.placeholder.com/40',
                      }}
                    />
                    <View style={{marginLeft: 10, flex: 1}}>
                      <Text>{item.name}</Text>
                      <Text style={{color: 'gray'}}>{item.email}</Text>
                    </View>
                    <IconButton
                      icon="account-plus"
                      onPress={() => addMember(item.id, item)}
                    />
                  </View>
                )}
              />
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
};
