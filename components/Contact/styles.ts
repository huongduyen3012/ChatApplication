import {StyleSheet} from 'react-native';
import theme from '../../constants/Theme';

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  searchBar: {
    elevation: 2,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    height: 48,
  },
  sectionHeader: {
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: `${theme.primary}10`,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: `${theme.primary}30`,
  },
  sectionHeaderText: {
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#e0e0e0',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  userInitial: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -4,
    bottom: -4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  initialText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'space-between',
  },
  avatar: {
    marginRight: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  // userName: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
  iconContainer: {
    flexDirection: 'row',
  },
});

export default styles;
