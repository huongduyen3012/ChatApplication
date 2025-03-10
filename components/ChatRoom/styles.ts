import {StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

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
  },
  messageBox: {
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    maxWidth: '80%',
  },
  name: {
    color: Colors.light.tint,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  message: {},
  time: {
    alignSelf: 'flex-end',
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#3777f0',
    borderRadius: 20,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultInfo: {
    marginLeft: 10,
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchResultEmail: {
    fontSize: 14,
    color: 'gray',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  searchBar: {
    marginBottom: 10,
    elevation: 0,
    borderRadius: 8,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  systemMessageText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  emptyListContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyListText: {
    color: 'gray',
    fontStyle: 'italic',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  memberAvatar: {
    marginRight: 10,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberEmail: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  adminBadge: {
    backgroundColor: '#3777f0',
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
  // inputContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: 10,
  //   backgroundColor: '#fff',
  //   borderTopWidth: 1,
  //   borderColor: '#ddd',
  // },
  // input: {
  //   flex: 1,
  //   padding: 10,
  //   borderRadius: 20,
  //   backgroundColor: '#f0f0f0',
  // },
  iconButton: {
    padding: 10,
    marginRight: 5,
  },
  // sendButton: {
  //   backgroundColor: '#007AFF',
  //   padding: 10,
  //   borderRadius: 20,
  // },
  uploadText: {
    textAlign: 'center',
    padding: 5,
    color: '#007AFF',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
    alignSelf: 'center',
  },
});

export default styles;
