/* eslint-disable no-const-assign */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import auth from '@react-native-firebase/auth';
import database, {DataSnapshot} from '@react-native-firebase/database';
import {useNavigation, useRoute} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
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
import {
  ChatRoomRouteProp,
  ChatRoomScreenProps,
  NavigationType,
  uploadBase64,
} from './helpers';
import styles from './styles';

export const ChatRoomScreen: React.FC<ChatRoomScreenProps> = props => {
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
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);

  useEffect(() => {
    const chatRef = database().ref(`chats/${chatId}`);
    chatRef.once('value', snapshot => {
      if (snapshot.exists()) {
        const chatData = snapshot.val();
        if (chatData.participants) {
          const updatedParticipants = {...chatData.participants};

          Object.keys(updatedParticipants).forEach(async userId => {
            if (!updatedParticipants[userId].phoneNumber) {
              try {
                const userSnapshot = await database()
                  .ref(`users/${userId}`)
                  .once('value');

                if (userSnapshot.exists()) {
                  const userData = userSnapshot.val();
                  if (userData.phoneNumber) {
                    updatedParticipants[userId].phoneNumber =
                      userData.phoneNumber;
                  }
                }
              } catch (error) {
                console.error('Error fetching participant data:', error);
              }
            }
          });

          setParticipants(updatedParticipants);
        } else {
          setParticipants(chatData.participants || {});
        }

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
              iconColor="#fff"
              onPress={() => setAddMemberModalVisible(true)}
            />
          )}
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                iconColor="#fff"
                onPress={() => setMenuVisible(true)}
              />
            }>
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                // @ts-ignore - Fix navigation type later
                navigation.navigate('ChatInfo', {
                  chatId,
                  isGroupChat,
                });
              }}
              title={isGroupChat ? 'Group Info' : 'Chat Info'}
              leadingIcon="information"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('MainTabs');
              }}
              title={'Back to Home'}
              leadingIcon="home"
            />
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

    let userSnapshot = await database()
      .ref(`users/${currentUser?.uid}`)
      .once('value');

    if (!userSnapshot.exists()) {
      console.error('User data not found. Creating basic user data.');
      await database()
        .ref(`users/${currentUser?.uid}`)
        .set({
          name: currentUser?.displayName || 'User',
          email: currentUser?.email || '',
          imageUrl: currentUser?.photoURL || 'https://i.pravatar.cc/150?img=1',
          phoneNumber: '',
          bio: '',
          createdAt: database.ServerValue.TIMESTAMP,
        });

      userSnapshot = await database()
        .ref(`users/${currentUser?.uid}`)
        .once('value');
    }

    const userInfo = userSnapshot.val();

    if (!userInfo) {
      Alert.alert('Error', 'Could not retrieve user information.');
      return;
    }

    const messagesRef = database().ref(`messages/${chatId}`);
    const newMessageRef = messagesRef.push();

    await newMessageRef.set({
      content: newMessage,
      createdAt: database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser?.uid,
        name: userInfo.name,
        imageUrl: userInfo.imageUrl,
        phoneNumber: userInfo.phoneNumber,
        bio: userInfo.bio,
      },
    });

    await database().ref(`chats/${chatId}`).update({
      lastMessage: newMessage,
      timestamp: database.ServerValue.TIMESTAMP,
    });

    setNewMessage('');
  };

  const deleteMessaage = async (messageId: string, userId: string) => {
    if (currentUser?.uid !== userId) {
      Alert.alert('Error', 'You are not allowed to delete this message');
      return;
    }

    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await database().ref(`messages/${chatId}/${messageId}`).remove();

              const latestMessageSnapshot = await database()
                .ref(`messages/${chatId}`)
                .orderByChild('createdAt')
                .limitToLast(1)
                .once('value');

              let newLastMessage = 'No messages';

              latestMessageSnapshot.forEach((child: DataSnapshot) => {
                const msg = child.val();
                newLastMessage = msg.mediaUrl
                  ? `[${msg.mediaType === 'image' ? 'Image' : 'File'}]`
                  : msg.content;
                return undefined;
              });
              await database().ref(`chats/${chatId}`).update({
                lastMessage: newLastMessage,
                timestamp: database.ServerValue.TIMESTAMP,
              });
            } catch (error) {
              console.log('Error delete message', error);
            }
          },
        },
      ],
    );
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
        <TouchableOpacity
          onLongPress={() => deleteMessaage(item._id, item.user.id)}
          delayLongPress={500}
          activeOpacity={0.7}>
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
              <Text style={styles.time}>
                {moment(item.createdAt).fromNow()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
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
        <AddMemberModal
          chatId={chatId}
          participants={participants}
          isVisible={addMemberModalVisible}
          onDismiss={() => setAddMemberModalVisible(false)}
        />
      </SafeAreaView>
    </Provider>
  );
};
