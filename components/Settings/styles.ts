import {StyleSheet} from 'react-native';
import theme from '../../constants/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 10,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.primary,
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 4,
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderColor: theme.border,
    borderWidth: 2,
  },
  settingItemText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
    color: theme.text,
    fontWeight: '500',
  },
  settingItemArrow: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 10,
  },
});

export default styles;
