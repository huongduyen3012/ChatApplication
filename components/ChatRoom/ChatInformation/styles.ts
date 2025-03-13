import {StyleSheet} from 'react-native';
import theme from '../../../constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: theme.surface,
  },
  avatar: {
    backgroundColor: theme.background,
    borderWidth: 3,
    borderColor: theme.surface,
  },
  name: {
    color: theme.primary,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },

  divider: {
    backgroundColor: theme.border,
    height: 1,
    marginVertical: 8,
  },
  sectionHeader: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 16,
  },
  mediaList: {
    marginTop: 10,
    flexGrow: 0,
  },
  mediaContent: {
    paddingHorizontal: 10,
  },
  mediaItem: {
    marginHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.textSecondary,
    fontStyle: 'italic',
    marginVertical: 20,
  },
  membersHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  membersHeader: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  addMemberText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.surface,
    marginVertical: 4,
    marginHorizontal: 10,
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
  // Group action buttons
  groupActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginVertical: 15,
  },
  groupActionButton: {
    alignItems: 'center',
    padding: 10,
  },
  groupActionText: {
    color: theme.primary,
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
  },
  memberCount: {
    color: theme.textSecondary,
    marginBottom: 15,
  },
  // Individual contact actions
  contactActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 15,
  },
  contactActionButton: {
    alignItems: 'center',
    padding: 15,
    width: 80,
  },
  contactActionText: {
    color: theme.primary,
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderColor: theme.border,
    borderWidth: 2,
  },
  settingItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
  },
});
