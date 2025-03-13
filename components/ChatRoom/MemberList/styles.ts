import {StyleSheet} from 'react-native';
import theme from '../../../constants/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.primary,
  },
  memberCount: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: theme.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  memberAvatar: {
    marginRight: 12,
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
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminBadge: {
    backgroundColor: theme.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  adminBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  removeButton: {
    padding: 8,
  },
  divider: {
    height: 0.5,
    backgroundColor: theme.border,
  },
  emptyListContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyListText: {
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
});
