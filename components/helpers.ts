import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export const generateMockChats = async () => {
  const currentUser = auth().currentUser;

  const userSnapshot = await database()
    .ref(`users/${currentUser?.uid}`)
    .once('value');

  const userInfo = userSnapshot.val();

  const mockChatList = {
    chat1: {
      participants: {
        sender: {
          id: currentUser!.uid,
          name: userInfo.name,
          email: userInfo.email,
          imageUrl: userInfo.imageUrl,
        },
        receiver: {
          id: 'user2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=11',
        },
      },
      messages: [],
      lastMessage: 'Hello, how are you?',
      timestamp: Date.now(),
      createdBy: currentUser!.uid,
      updatedAt: Date.now(),
    },
    chat2: {
      participants: {
        sender: {
          id: currentUser!.uid,
          name: userInfo.name,
          email: userInfo.email,
          imageUrl: userInfo.imageUrl,
        },
        receiver: {
          id: 'user3',
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          imageUrl: 'https://i.pravatar.cc/150?img=3',
        },
      },
      messages: [],
      lastMessage: "Let's meet tomorrow!",
      timestamp: Date.now(),
      createdBy: currentUser!.uid,
      updatedAt: Date.now(),
    },
  };

  return mockChatList;
};
