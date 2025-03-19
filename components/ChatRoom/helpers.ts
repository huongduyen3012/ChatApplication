import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {NavigationProp, RouteProp} from '@react-navigation/core';
import {Alert} from 'react-native';
import RNFS from 'react-native-fs';
import {RootStackParamList} from '../../App';

export interface ChatRoomScreenProps {
  chatId?: string;
  name?: string;
  navigation: any;
}

export type ChatRoomRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;
export type NavigationType = NavigationProp<RootStackParamList>;

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
      content: newMessage || '',
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

// export const downloadFile = async (url: string, fileName: string) => {
//   try {
//     if (url.startsWith('data:')) {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: 'Storage Permission',
//             message: 'App needs access to storage to download files',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );

//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           Alert.alert('Permission Denied', 'Storage permission is required');
//           return;
//         }
//       }

//       const base64Data = url.split(',')[1];
//       const isImage = url.includes('image/');

//       if (isImage) {
//         const tempFilePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

//         await RNFS.writeFile(tempFilePath, base64Data, 'base64');

//         await CameraRoll.save(`file://${tempFilePath}`, {type: 'photo'});

//         await RNFS.unlink(tempFilePath);

//         return tempFilePath;
//       } else {
//         const downloadPath =
//           Platform.OS === 'ios'
//             ? RNFS.DocumentDirectoryPath
//             : RNFS.DownloadDirectoryPath;

//         const filePath = `${downloadPath}/${fileName}`;

//         await RNFS.writeFile(filePath, base64Data, 'base64');

//         return filePath;
//       }
//     } else {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: 'Storage Permission',
//             message: 'App needs access to storage to download files',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );

//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//           Alert.alert('Permission Denied', 'Storage permission is required');
//           return;
//         }
//       }

//       const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i) !== null;

//       if (isImage) {
//         await CameraRoll.save(url);
//         return;
//       }

//       const downloadPath =
//         Platform.OS === 'ios'
//           ? RNFS.DocumentDirectoryPath
//           : RNFS.DownloadDirectoryPath;

//       const filePath = `${downloadPath}/${fileName}`;

//       const options = {
//         fromUrl: url,
//         toFile: filePath,
//         background: true,
//         discretionary: true,
//       };

//       const {promise} = RNFS.downloadFile(options);
//       await promise;

//       return filePath;
//     }
//   } catch (error) {
//     console.error('Download error:', error);
//     throw error;
//   }
// };
