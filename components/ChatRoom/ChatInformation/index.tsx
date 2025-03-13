/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Avatar,
  Button,
  Caption,
  Divider,
  Icon,
  List,
  Title,
} from 'react-native-paper';
import theme from '../../../constants/Theme';
import { ChatParticipant } from '../../../types';
import { styles } from './styles';

export function ChatInfoScreen({navigation}: {navigation: any}) {
  const route = useRoute<any>();
  const {chatId, participant, isGroup} = route.params;
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [otherFiles, setOtherFiles] = useState<any[]>([]);
  const [receiverInfo, setReceiverInfo] = useState<ChatParticipant | null>(
    participant || null,
  );
  const [groupInfo, setGroupInfo] = useState<any>(null);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [_, setIsLoading] = useState(true);

  const currentUser = auth().currentUser;

  useEffect(() => {
    navigation.setOptions({
      title: 'Chat Information',
      headerStyle: {
        backgroundColor: theme.primary,
      },
      headerTintColor: '#fff',
    });

    const loadMedia = async () => {
      setIsLoading(true);
      try {
        const messageRef = database().ref(`/messages/${chatId}`);
        const snapshot = await messageRef.once('value');

        const media: any[] = [];
        const files: any[] = [];

        if (snapshot.exists()) {
          snapshot.forEach(child => {
            const message = child.val();
            if (message.mediaUrl) {
              const fileItem = {
                id: child.key,
                url: message.mediaUrl,
                name: message.fileName || 'Unnamed file',
                type: message.mediaType,
                timestamp: message.createdAt,
              };
              if (message.mediaType === 'image') {
                media.push(fileItem);
              } else {
                files.push(fileItem);
              }
            }
            return undefined;
          });
        }
        setMediaFiles(media);
        setOtherFiles(files);
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Failed to load media files');
      } finally {
        setIsLoading(false);
      }
    };
    const loadBasicChatInfo = async () => {
      try {
        const chatRef = database().ref(`chats/${chatId}`);
        const snapshot = await chatRef.once('value');

        if (snapshot.exists()) {
          const chatData = snapshot.val();

          if (chatData.type === 'group' || isGroup) {
            setGroupInfo({
              name: chatData.name,
              imageUrl: chatData.imageUrl,
              createdAt: chatData.createdAt,
              createdBy: chatData.createdBy,
            });
            return;
          }

          if (currentUser && chatData.participants) {
            if (
              chatData.participants.sender &&
              chatData.participants.receiver
            ) {
              if (chatData.participants.sender.id === currentUser.uid) {
                setReceiverInfo(chatData.participants.receiver);
                return;
              } else if (
                chatData.participants.receiver.id === currentUser.uid
              ) {
                setReceiverInfo(chatData.participants.sender);
                return;
              }
            } else {
              const participantIds = Object.keys(chatData.participants);
              const otherParticipantId = participantIds.find(
                id => id !== currentUser.uid,
              );

              if (otherParticipantId) {
                const otherParticipantInfo =
                  chatData.participants[otherParticipantId];
                setReceiverInfo({
                  name: otherParticipantInfo.name,
                  email: otherParticipantInfo.email || '',
                  imageUrl: otherParticipantInfo.imageUrl || '',
                  isAdmin: otherParticipantInfo.isAdmin,
                });
                return;
              }
            }
          }
        } else {
          console.log('Chat not found with ID:', chatId);
        }
      } catch (error) {
        console.log('Error loading chat info:', error);
        Alert.alert('Error', 'Failed to load chat information');
      }
    };

    loadBasicChatInfo();
    loadMedia();
  }, [chatId, navigation, participant, currentUser, isGroup]);

  const renderMediaItem = ({item}: {item: any}) => (
    <TouchableOpacity style={styles.mediaItem}>
      <Image
        source={{uri: item.url}}
        style={styles.mediaImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderFileItem = ({item}: {item: any}) => (
    <List.Item
      title={item.name}
      titleStyle={{color: theme.text, fontWeight: '500'}}
      description={new Date(item.timestamp).toLocaleString()}
      descriptionStyle={{color: theme.textSecondary, fontSize: 12}}
      left={props => <List.Icon {...props} icon="file" color={theme.primary} />}
      right={props => (
        <Button
          {...props}
          children="Download"
          icon="download"
          mode="text"
          color={theme.primary}
        />
      )}
      style={{
        backgroundColor: theme.surface,
        marginHorizontal: 10,
        marginVertical: 4,
        borderRadius: 8,
      }}
    />
  );

  const handleLeaveGroup = async () => {
    if (!currentUser) {
      return;
    }

    Alert.alert('Leave Group', 'Are you sure you want to leave this group?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: async () => {
          try {
            await database()
              .ref(`chats/${chatId}/members/${currentUser.uid}`)
              .remove();

            navigation.navigate('ChatScreen');
            Alert.alert('Success', 'You have left the group');
          } catch (error) {
            console.error('Error leaving group:', error);
            Alert.alert('Error', 'Failed to leave group');
          }
        },
      },
    ]);
  };

  const handleEditGroup = () => {
    if (!isAdmin) {
      Alert.alert('Error', 'Only admins can edit group details');
      return;
    }

    Alert.alert('Coming Soon', 'Group editing will be available soon');
  };

  useEffect(() => {
    if (!chatId) {
      return;
    }

    const membersRef = database().ref(`chats/${chatId}/members`);

    const handleMembersChange = (snapshot: any) => {
      if (snapshot.exists()) {
        const membersData = snapshot.val();
        const membersArray = Object.entries(membersData).map(
          ([memberId, memberData]: [string, any]) => ({
            id: memberId,
            ...(typeof memberData === 'object' && memberData !== null
              ? memberData
              : {}),
          }),
        );

        console.log(
          'ChatInfo - realtime update, members:',
          membersArray.length,
        );
        setGroupMembers(membersArray);

        if (currentUser) {
          const currentMember = membersData[currentUser.uid];
          if (currentMember) {
            const isUserAdmin =
              currentMember.isAdmin || currentMember.role === 'admin';
            setIsAdmin(isUserAdmin);
          }
        }
      } else {
        setGroupMembers([]);
      }
    };

    membersRef.on('value', handleMembersChange);

    return () => {
      membersRef.off('value', handleMembersChange);
    };
  }, [chatId, currentUser]);
  return (
    <ScrollView style={styles.container}>
      {groupInfo ? (
        <View style={styles.profileContainer}>
          <Avatar.Image
            size={80}
            source={{uri: groupInfo.imageUrl}}
            style={styles.avatar}
          />
          <Title style={styles.name}>{groupInfo.name}</Title>
          <Caption style={styles.memberCount}>
            {groupMembers.length} members
          </Caption>

          <View style={styles.groupActionsContainer}>
            <TouchableOpacity
              style={styles.groupActionButton}
              onPress={handleEditGroup}>
              <Icon source="pencil" size={24} color={theme.primary} />
              <Text style={styles.groupActionText}>Edit Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.groupActionButton}
              onPress={handleLeaveGroup}>
              <Icon source="exit-to-app" size={24} color={theme.error} />
              <Text style={[styles.groupActionText, {color: theme.error}]}>
                Leave Group
              </Text>
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              navigation.navigate('MemberList', {
                chatId: chatId,
                members: groupMembers,
                isGroupAdmin: isAdmin,
              })
            }>
            <View style={styles.settingItemIcon}>
              <Icon source="account-group" size={24} color={theme.primary} />
            </View>
            <View style={styles.settingItemContent}>
              <Text style={styles.settingItemTitle}>See chat members</Text>
            </View>
            <Icon
              source="chevron-right"
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <Avatar.Image
            size={80}
            source={{
              uri: receiverInfo?.imageUrl || 'https://via.placeholder.com/80',
            }}
            style={styles.avatar}
          />
          <Title style={styles.name}>{receiverInfo?.name || 'User'}</Title>

          <View style={styles.contactActionContainer}>
            <TouchableOpacity style={styles.contactActionButton}>
              <Icon source="phone" size={24} color={theme.primary} />
              <Text style={styles.contactActionText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactActionButton}>
              <Icon source="video" size={24} color={theme.primary} />
              <Text style={styles.contactActionText}>Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactActionButton}>
              <Icon source="account-details" size={24} color={theme.primary} />
              <Text style={styles.contactActionText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Divider style={styles.divider} />

      <List.Section>
        <List.Subheader style={styles.sectionHeader}>Images</List.Subheader>
        {mediaFiles.length > 0 ? (
          <FlatList
            data={mediaFiles}
            renderItem={renderMediaItem}
            keyExtractor={item => item.id}
            horizontal
            style={styles.mediaList}
            contentContainerStyle={styles.mediaContent}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text style={styles.emptyText}>No images shared</Text>
        )}
      </List.Section>

      <Divider style={styles.divider} />

      <List.Section>
        <List.Subheader style={styles.sectionHeader}>Files</List.Subheader>
        {otherFiles.length > 0 ? (
          <FlatList
            data={otherFiles}
            renderItem={renderFileItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={{paddingBottom: 20}}
          />
        ) : (
          <Text style={styles.emptyText}>No files shared</Text>
        )}
      </List.Section>
    </ScrollView>
  );
}
