import {StyleSheet} from 'react-native';
import theme from '../../constants/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.surface,
    marginBottom: 5,
    // Add subtle shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chatTypeButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 5,
    // Add subtle border
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeButton: {
    backgroundColor: theme.primary,
    // Add subtle shadow for depth
    shadowColor: theme.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  groupNameContainer: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    // backgroundColor: theme.surface,
  },
  groupNameInput: {
    // padding: 12,
    marginBottom: 13,
    backgroundColor: theme.background,
    // color: theme.text,
    // fontSize: 16,
  },
  createGroupButton: {
    backgroundColor: theme.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    // Add subtle shadow for depth
    shadowColor: theme.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  createGroupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchBar: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderWidth: 1,
    height: 60,
  },
  selectedUsersContainer: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.surface,
  },
  selectedUserChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectedUserName: {
    marginRight: 8,
    color: 'white',
    fontWeight: '500',
  },
  userItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.surface,
  },
  selectedUserItem: {
    backgroundColor: `${theme.primary}15`,
  },
  avatar: {
    marginRight: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  searchContainer: {
    padding: 10,
  },
  createGroupChatButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: `${theme.primary}10`,
    borderWidth: 1,
    borderColor: theme.border,
  },
  createGroupButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createGroupChatText: {
    marginLeft: 8,
    color: theme.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textSecondary,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  divider: {
    backgroundColor: theme.border,
    marginVertical: 10,
  },
  groupModeHeader: {
    backgroundColor: theme.surface,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedUsersTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textSecondary,
    marginBottom: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelGroupButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: theme.primary,
    marginRight: 10,
  },
  cancelGroupButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default styles;
