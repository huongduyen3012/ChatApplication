/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import database from '@react-native-firebase/database';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../../constants/Theme';
import {styles} from './styles';

export const MemberList = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {chatId, members, isGroupAdmin} = route.params;
  const [localMembers, setLocalMembers] = useState<any[]>([]);

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
          'MemberList - realtime update, members:',
          membersArray.length,
        );
        setLocalMembers(membersArray);
      } else {
        setLocalMembers([]);
      }
    };

    membersRef.on('value', handleMembersChange);

    return () => {
      membersRef.off('value', handleMembersChange);
    };
  }, [chatId]);

  const handleRemoveMember = async (userId: string, memberName: string) => {
    if (!isGroupAdmin) {
      Alert.alert(
        'Permission Denied',
        'Only group administrators can remove members',
      );
      return;
    }

    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName} from the group?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await database()
                .ref(`chats/${chatId}/members/${userId}`)
                .remove();

              const messagesRef = database().ref(`messages/${chatId}`);
              const systemMessageRef = messagesRef.push();

              await systemMessageRef.set({
                content: `${memberName} has been removed from the chat`,
                createdAt: database.ServerValue.TIMESTAMP,
                system: true,
                user: {
                  _id: 'system',
                  name: 'System',
                  imageUrl: '',
                },
              });
            } catch (error) {
              console.error('Error removing member:', error);
              Alert.alert(
                'Error',
                'Failed to remove member. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  const renderMemberItem = ({item}: {item: any}) => {
    const memberId = item.id || '';
    const isAdmin = item.isAdmin || item.role === 'admin';
    const memberName = item.name || 'Unknown';

    return (
      <View style={styles.memberItem}>
        <Avatar.Image
          size={50}
          source={{
            uri: item.imageUrl || 'https://via.placeholder.com/50',
          }}
          style={styles.memberAvatar}
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name || 'Unknown'}</Text>
          {item.email && <Text style={styles.memberEmail}>{item.email}</Text>}
        </View>
        <View style={styles.memberActions}>
          {isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          )}
          {isGroupAdmin && !isAdmin && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveMember(memberId, memberName)}>
              <Icon name="account-remove" size={22} color={theme.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={localMembers}
        keyExtractor={item => item.id}
        renderItem={renderMemberItem}
        contentContainerStyle={{paddingVertical: 10, paddingHorizontal: 16}}
        ItemSeparatorComponent={() => <View style={{height: 8}} />}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Icon
              name="account-group"
              size={60}
              color={`${theme.textSecondary}60`}
            />
            <Text style={styles.emptyListText}>No members in this group</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};
