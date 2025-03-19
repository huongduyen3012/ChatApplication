import {StyleSheet} from 'react-native';
import theme from '../../../constants/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    marginBottom: 15,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: theme.text,
  },
  email: {
    fontSize: 16,
    color: theme.textSecondary,
    marginTop: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  phoneText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 6,
  },
  bioContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.textSecondary,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.text,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 90,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 2,
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.primary,
    fontWeight: '600',
  },
  divider: {
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#e0e0e0',
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.05,
    // shadowRadius: 2,
    // elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.textSecondary,
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: theme.text,
    marginLeft: 15,
  },
});

export default styles;
