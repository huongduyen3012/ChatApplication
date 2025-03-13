import {StyleSheet} from 'react-native';
import theme from '../../constants/Theme';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  avatar: {
    marginRight: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: theme.border,
  },
  messageBox: {
    borderRadius: 18,
    padding: 12,
    marginBottom: 5,
    maxWidth: '80%',
  },
  name: {
    color: theme.primary,
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 13,
  },
  message: {
    color: theme.text,
    fontSize: 15,
    lineHeight: 20,
  },
  time: {
    alignSelf: 'flex-end',
    color: theme.textSecondary,
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderColor: theme.border,
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 22,
    paddingHorizontal: 18,
    backgroundColor: theme.background,
    marginRight: 10,
    fontSize: 15,
    color: theme.text,
  },
  sendButton: {
    backgroundColor: theme.primary,
    borderRadius: 22,
    height: 44,
    width: 44,
    margin: 0,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.surface,
  },
  searchResultInfo: {
    marginLeft: 10,
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
  },
  searchResultEmail: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  modalContainer: {
    backgroundColor: theme.surface,
    padding: 20,
    margin: 20,
    borderRadius: 16,
    // Add shadow for modal
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  searchBar: {
    marginBottom: 10,
    elevation: 0,
    borderRadius: 8,
    backgroundColor: theme.background,
    borderColor: theme.border,
    borderWidth: 1,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 5,
  },
  systemMessageText: {
    color: theme.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyListText: {
    color: theme.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 15,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.surface,
    marginVertical: 4,
    borderRadius: 12,
    // Add subtle shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  memberAvatar: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
  },
  memberEmail: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 2,
  },
  adminBadge: {
    backgroundColor: theme.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  iconButton: {
    padding: 10,
    marginRight: 5,
    borderRadius: 20,
  },

  uploadText: {
    textAlign: 'center',
    padding: 5,
    color: theme.primary,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginTop: 8,
    alignSelf: 'center',
  },

  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: theme.border,
  },
  fileName: {
    marginLeft: 8,
    color: theme.primary,
    flex: 1,
    fontSize: 14,
  },

  messageOptions: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberListTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginBottom: 10,
    // Add subtle shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  memberListTriggerText: {
    flex: 1,
    fontSize: 16,
    color: theme.text,
    marginLeft: 10,
  },
  memberCountBadge: {
    backgroundColor: theme.primary,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  membersList: {
    maxHeight: 400,
  },
  memberDivider: {
    backgroundColor: theme.border,
    height: 0.5,
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  removeButton: {
    padding: 8,
  },
});

export default styles;
