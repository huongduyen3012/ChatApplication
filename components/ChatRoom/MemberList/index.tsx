/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {FlatList, Modal, SafeAreaView, View} from 'react-native';
import {ChatParticipant} from '../../../types';
import {
  Avatar,
  Divider,
  IconButton,
  Portal,
  Provider,
  Text,
} from 'react-native-paper';
import {useState} from 'react';
import styles from '../styles';

export const MemberList = ({
  participants,
}: {
  participants: Record<string, ChatParticipant>;
}) => {
  const [isMembersListVisible, setIsMembersListVisible] = useState(false);
  const renderMemberItem = ({
    item,
  }: {
    item: ChatParticipant;
    userId: string;
  }) => (
    <View style={styles.memberItem}>
      <Avatar.Image
        size={50}
        source={{
          uri: item.imageUrl || 'https://via.placeholder.com/50',
        }}
        style={styles.memberAvatar}
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
      {item.isAdmin && (
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>Admin</Text>
        </View>
      )}
    </View>
  );
  return (
    <Provider>
      <SafeAreaView>
        <Portal>
          <Modal
            visible={isMembersListVisible}
            onDismiss={() => setIsMembersListVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chat Members</Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setIsMembersListVisible(false)}
                />
              </View>
              <FlatList
                data={Object.entries(participants).map(([key, value]) => ({
                  userId: key,
                  ...value,
                }))}
                keyExtractor={item => item.userId}
                style={{maxHeight: 400}}
                renderItem={({item}) =>
                  renderMemberItem({item, userId: item.userId})
                }
                // eslint-disable-next-line react/no-unstable-nested-components
                ItemSeparatorComponent={() => <Divider />}
                ListEmptyComponent={
                  <View style={styles.emptyListContainer}>
                    <Text style={styles.emptyListText}>No members found</Text>
                  </View>
                }
              />
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
};
