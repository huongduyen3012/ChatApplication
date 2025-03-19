import {StyleSheet} from 'react-native';
import theme from '../../constants/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  editAvatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.border,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 6,
    // Add subtle shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 5,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.surface,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  statLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 5,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
    color: theme.text,
  },
  menuItemArrow: {
    opacity: 0.3,
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  phoneIcon: {
    marginRight: 6,
  },
  phoneText: {
    fontSize: 14,
    color: '#666',
  },
  bioContainer: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default styles;
