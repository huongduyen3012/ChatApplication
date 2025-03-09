/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Avatar, Divider, IconButton, Menu, Provider} from 'react-native-paper';
import {ChatParticipant, Message} from '../../types';
import {AddMemberModal} from './AddMemberModal';
import {MemberList} from './MemberList';
import styles from './styles';

type RootStackParamList = {
  ChatRoom: {chatId: string, name: string};
};

type ChatRoomRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;
type NavigationType = NavigationProp<RootStackParamList>;

export function ChatRoomScreen() {
  const route = useRoute<ChatRoomRouteProp>();
  const navigation = useNavigation<NavigationType>();
  const {chatId, name} = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<
    Record<string, ChatParticipant>
  >({});
  const currentUser = auth().currentUser;
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [chatInfo, setChatInfo] = useState<any>(null);

  useEffect(() => {
    const chatRef = database().ref(`chats/${chatId}`);
    chatRef.once('value', snapshot => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();
        setParticipants(chatData.participants || {});
        setChatInfo(chatData);
        setIsGroupChat(chatData.type === 'group');


        // if (chatData.type !== 'group') {
        //   // Find receiver's name
        //   const otherUser = Object.values(chatData.participants).find(
        //     (user: any) => user.id !== currentUser?.uid,
        //   );
        //   setReceiverName(otherUser?.name || 'Chat');
        // } else {
        //   setReceiverName(chatData.name);
        // }
      }
    });

    const messagesRef = database().ref(`messages/${chatId}`);
    const onMessageUpdate = (snapshot: any) => {
      if (snapshot.exists()) {
        const messageList: Message[] = [];
        snapshot.forEach((child: any) => {
          messageList.push({
            _id: child.key,
            ...child.val(),
          });
        });
        setMessages(messageList.reverse());
      }
    };

    messagesRef.on('value', onMessageUpdate);

    return () => messagesRef.off('value', onMessageUpdate);
  }, [chatId]);

  useEffect(() => {
    navigation.setOptions({
      title: name || 'Chat',
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          {isGroupChat && (
            <IconButton
              icon="account-plus"
              onPress={() => {
                <AddMemberModal chatId={chatId} participants={participants} />;
              }}
            />
          )}
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => setMenuVisible(true)}
              />
            }>
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                <MemberList participants={participants} />;
              }}
              title="View Members"
              leadingIcon="account-group"
            />
            <Divider />
          </Menu>
        </View>
      ),
    });
  }, [navigation, isGroupChat, chatInfo, menuVisible]);

  const isMyMessage = (userId: string) => {
    return userId === currentUser?.uid;
  };

  const sendMessage = async () => {
    if (newMessage.trim().length === 0) {
      return;
    }

    const userSnapshot = await database()
      .ref(`users/${currentUser?.uid}`)
      .once('value');

    const userInfo = userSnapshot.val();

    const messagesRef = database().ref(`messages/${chatId}`);
    const newMessageRef = messagesRef.push();

    await newMessageRef.set({
      content: newMessage,
      createdAt: database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser?.uid,
        name: userInfo.name,
        imageUrl: userInfo.imageUrl,
      },
    });

    await database().ref(`chats/${chatId}`).update({
      lastMessage: newMessage,
      timestamp: database.ServerValue.TIMESTAMP,
    });

    setNewMessage('');
  };

  const renderMessage = ({item}: {item: Message}) => (
    <View style={styles.container}>
      {item.system ? (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.content}</Text>
        </View>
      ) : (
        <View
          style={[
            styles.messageRow,
            {
              justifyContent: isMyMessage(item.user.id)
                ? 'flex-end'
                : 'flex-start',
            },
          ]}>
          {!isMyMessage(item.user.id) && (
            <Avatar.Image
              size={40}
              source={{
                uri:
                  participants[item.user.id]?.imageUrl ||
                  item.user.imageUrl ||
                  'https://via.placeholder.com/40',
              }}
              style={styles.avatar}
            />
          )}
          <View
            style={[
              styles.messageBox,
              {
                backgroundColor: isMyMessage(item.user.id)
                  ? '#DCF8C5'
                  : 'white',
                marginLeft: isMyMessage(item.user.id) ? 50 : 10,
                marginRight: isMyMessage(item.user.id) ? 0 : 50,
              },
            ]}>
            {!isMyMessage(item.user.id) && (
              <Text style={styles.name}>{item.user.name}</Text>
            )}
            <Text style={styles.message}>{item.content}</Text>
            <Text style={styles.time}>{moment(item.createdAt).fromNow()}</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Provider>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
          <ImageBackground
            style={{width: '100%', height: '100%'}}
            source={require('../../assets/BG.png')}>
            <FlatList
              data={messages}
              inverted
              keyExtractor={item => item._id}
              renderItem={renderMessage}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                value={newMessage}
                onChangeText={setNewMessage}
              />
              <IconButton
                icon="send"
                size={20}
                style={styles.sendButton}
                iconColor="#fff"
                onPress={sendMessage}
              />
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Provider>
  );
}
