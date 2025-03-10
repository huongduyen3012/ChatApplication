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
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import DocumentPicker, {types} from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  Avatar,
  Divider,
  Icon,
  IconButton,
  Menu,
  Provider,
} from 'react-native-paper';
import {ChatParticipant, Message} from '../../types';
import {AddMemberModal} from './AddMemberModal';
import {uploadBase64} from './helpers';
import {MemberList} from './MemberList';
import styles from './styles';

type RootStackParamList = {
  ChatRoom: {chatId: string; name: string};
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
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const chatRef = database().ref(`chats/${chatId}`);
    chatRef.once('value', snapshot => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();
        setParticipants(chatData.participants || {});
        setChatInfo(chatData);
        setIsGroupChat(chatData.type === 'group');
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
      // await uploadBase64('', 'text', '', chatId, newMessage, setIsUploading);
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
  const handleSelectImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        const selectedImage: string = result.assets[0].uri;
        console.log('Selected Image URI:', selectedImage);

        await uploadBase64(
          selectedImage,
          'image',
          result.assets[0].fileName || 'image.jpg',
          chatId,
          '',
          setIsUploading,
        );
      } else {
        console.warn('No image selected.');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const handleSelectFile = async () => {
    const result = await DocumentPicker.pick({type: [types.allFiles]});
    if (result.length > 0) {
      await uploadBase64(
        result[0].uri,
        'file',
        result[0].name || 'file',
        chatId,
        newMessage,
        setIsUploading,
      );
    }
  };
  const actionSheetRef = useRef<ActionSheet>(null);

  const handleAttachmentPress = () => {
    actionSheetRef.current?.show();
  };

  const handleActionSheetPress = (index: number) => {
    if (index === 0) {
      handleSelectImage();
    } else if (index === 1) {
      handleSelectFile();
    }
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
            {item.mediaUrl && item.mediaType === 'image' ? (
              <Image
                source={{uri: item.mediaUrl}}
                style={styles.messageImage}
                resizeMode="contain"
                onError={e =>
                  console.error('Image Load Error:', e.nativeEvent.error)
                }
              />
            ) : null}
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
            {isUploading && <Text>Uploading...</Text>}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                onPress={handleAttachmentPress}
                style={styles.iconButton}>
                <Icon source="attachment" size={24} color="#555" />
              </TouchableOpacity>
              <ActionSheet
                ref={actionSheetRef}
                title="Choose an option"
                options={['Select Image', 'Select File', 'Cancel']}
                cancelButtonIndex={2}
                onPress={handleActionSheetPress}
              />
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
