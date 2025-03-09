import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItemText: {
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  settingItemArrow: {
    opacity: 0.3,
  },
});

export default styles;
