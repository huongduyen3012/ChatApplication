/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Avatar, FAB, IconButton} from 'react-native-paper';
import {Chat, User} from '../types';
import {generateMockChats} from './helpers';
import styles from './styles';

const HomeScreen = ({navigation}: {navigation: any}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (!currentUser) {
      navigation.replace('Login');
      return;
    }

    const chatsRef = database().ref('chats');

    const fetchAndUploadMockData = async () => {
      try {
        const snapshot = await chatsRef.once('value');
        if (!snapshot.exists()) {
          const mockChatList = await generateMockChats();
          await chatsRef.set(mockChatList);
        }
      } catch (error) {
        console.error('❌ Error uploading mock data:', error);
      }
    };
    fetchAndUploadMockData();

    const unsubscribe = chatsRef.on('value', snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const chatList: Chat[] = Object.entries(data)
          .filter(([_, chatData]: [string, any]) => {
            if (chatData.type === 'group') {
              return chatData.members && chatData.members[currentUser.uid];
            }
            const participants = chatData.participants;
            return (
              participants?.sender?.id === currentUser.uid ||
              participants?.receiver?.id === currentUser.uid
            );
          })
          .map(([chatId, chatData]: [string, any]) => ({
            _id: chatId,
            type: chatData.type || 'individual',
            name: chatData.name,
            imageUrl: chatData.imageUrl,
            participants: chatData.participants,
            members: chatData.members,
            lastMessage: chatData.lastMessage || 'No messages yet',
            timestamp: chatData.timestamp || Date.now(),
            createdBy: chatData.createdBy,
            updatedAt: chatData.updatedAt,
          }));

        setChats(chatList);
        setFilteredChats(chatList);
      } else {
        setChats([]);
        setFilteredChats([]);
      }
      setLoading(false);
    });

    return () => chatsRef.off('value', unsubscribe);
  }, [currentUser, navigation]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChats(chats);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();

    const filtered = chats.filter(chat => {
      if (chat.type === 'group') {
        return chat.name?.toLowerCase().includes(lowercaseQuery);
      }

      if (chat.participants) {
        const otherUser =
          chat.participants.sender.id === currentUser?.uid
            ? chat.participants.receiver
            : chat.participants.sender;
        return otherUser?.name.toLowerCase().includes(lowercaseQuery);
      }
      return false;
    });

    setFilteredChats(filtered);
  }, [searchQuery, chats, currentUser?.uid]);

  const renderChatItem = ({item}: {item: Chat}) => {
    if (item.type === 'group') {
      return (
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('ChatScreen', {
              chatId: item._id,
              name: item.name,
            })
          }>
          <View style={styles.container}>
            <View style={styles.lefContainer}>
              <View style={{width: 60, height: 50}}>
                <Avatar.Image
                  size={50}
                  source={{
                    uri: item.imageUrl || 'https://via.placeholder.com/50',
                  }}
                  style={{
                    borderWidth: 2,
                    borderColor: '#fff',
                    backgroundColor: '#f0f0f0',
                  }}
                />
              </View>
              <View style={styles.midContainer}>
                <Text style={[styles.username, {color: '#420475'}]}>
                  {item.name}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[styles.lastMessage, {color: '#666'}]}>
                  {item.lastMessage}
                </Text>
              </View>
            </View>
            <Text style={[styles.time, {fontSize: 12}]}>
              {moment(item.timestamp).format('DD/MM/YYYY')}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    let otherUser: User | undefined;

    if (item.participants) {
      otherUser =
        item.participants.sender.id === currentUser?.uid
          ? item.participants.receiver
          : item.participants.sender;
    }
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          navigation.navigate('ChatScreen', {
            chatId: item._id,
            name: item.type === 'group' ? item.name : otherUser?.name,
          });
          console.log(item._id, otherUser?.name);
        }}>
        <View style={styles.container}>
          <View style={styles.lefContainer}>
            <View style={{width: 60, height: 50}}>
              <Avatar.Image
                size={50}
                source={{uri: otherUser?.imageUrl}}
                style={{
                  borderWidth: 2,
                  borderColor: '#fff',
                  backgroundColor: '#f0f0f0',
                }}
              />
            </View>
            <View style={styles.midContainer}>
              <Text style={[styles.username, {color: '#420475'}]}>
                {otherUser?.name || 'Unknown User'}
              </Text>
              <Text
                numberOfLines={2}
                style={[styles.lastMessage, {color: '#666'}]}>
                {item.lastMessage}
              </Text>
            </View>
          </View>
          <Text style={[styles.time, {fontSize: 12}]}>
            {moment(item.timestamp).format('DD/MM/YYYY')}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#420475" />
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, {backgroundColor: '#f5f5f5'}]}>
      <View
        style={[
          styles.searchContainer,
          {
            margin: 15,
            backgroundColor: 'white',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#e0e0e0',
          },
        ]}>
        <IconButton
          icon="magnify"
          size={24}
          iconColor="#420475"
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, {color: '#333'}]}
          placeholder="Search chats..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        {searchQuery.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            iconColor="#666"
            onPress={() => setSearchQuery('')}
          />
        )}
      </View>

      <FlatList
        data={filteredChats}
        keyExtractor={item => item._id}
        renderItem={renderChatItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 80,
          paddingHorizontal: 15,
        }}
        style={{flex: 1}}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: '#666'}]}>
              {searchQuery.length > 0
                ? 'No chats found matching your search'
                : 'No chats yet. Start a new conversation!'}
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        style={[
          styles.fab,
          {
            backgroundColor: '#420475',
            borderRadius: 16,
          },
        ]}
        onPress={() => navigation.navigate('NewChat')}
        color="white"
      />
    </View>
  );
};

export default HomeScreen;
