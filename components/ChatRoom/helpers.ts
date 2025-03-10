import RNFS from 'react-native-fs';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';

export const uploadBase64 = async (
  uri: string,
  type: 'image' | 'file',
  fileName: string,
  chatId: string,
  newMessage: string,
  setIsUploading: (uploading: boolean) => void,
) => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    return;
  }

  try {
    setIsUploading(true);

    const base64Data = await RNFS.readFile(uri, 'base64');
    const mediaUrl = `data:image/jpeg;base64,${base64Data}`;

    const newMessageRef = database().ref(`messages/${chatId}`).push();

    const messageData = {
      _id: newMessageRef.key!,
      content:
        newMessage || (type === 'image' ? 'Sent an image' : 'Sent a file'),
      createdAt: Date.now(),
      user: {
        id: currentUser.uid,
        name: currentUser.displayName || 'Unknown',
      },
      mediaUrl,
      mediaType: type,
      fileName,
    };

    await newMessageRef.set(messageData);

    await database()
      .ref(`chats/${chatId}`)
      .update({
        lastMessage: `[${type === 'image' ? 'Image' : 'File'}]`,
        timestamp: database.ServerValue.TIMESTAMP,
      });

    setIsUploading(false);
  } catch (error) {
    console.error('Upload Error:', error);
    Alert.alert('Error', 'Failed to upload file');
    setIsUploading(false);
  }
};
