/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  createAgoraRtcEngine,
  IRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
  ClientRoleType,
  RenderModeType,
} from 'react-native-agora';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import {NavigationProp, RouteProp, useNavigation, useRoute} from '@react-navigation/native';

const appId = '1:194213890097:android:de2469b66df57698306d10';

type RootStackParamList = {
  VideoCallScreen: {
    channelName: string;
  };
};

type VideoCallScreenRouteProp = RouteProp<RootStackParamList, 'VideoCallScreen'>;

function VideoCallScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<VideoCallScreenRouteProp>();
  const {channelName} = route.params;
  const [engine, setEngine] = useState<IRtcEngine | null>(null);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState<number[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [localUid, setLocalUid] = useState<number>(0);

  useEffect(() => {
    initializeAgora();
    return () => {
      engine?.release();
    };
  }, []);

  const requestCameraAndAudioPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          granted['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.CAMERA'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
          return true;
        } else {
          console.log('Permission denied');
          Alert.alert(
            'Permissions required',
            'Please grant camera and audio permissions to use video call.',
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        Alert.alert('Error', 'Failed to request permissions');
        return false;
      }
    }
    return true;
  };

  const initializeAgora = async () => {
    const permissionGranted = await requestCameraAndAudioPermission();
    if (!permissionGranted) {
      return;
    }

    try {
      // Create RtcEngine instance
      const engineInstance = createAgoraRtcEngine();
      engineInstance.initialize({appId});

      // Set channel profile and client role
      engineInstance.setChannelProfile(
        ChannelProfileType.ChannelProfileLiveBroadcasting,
      );
      engineInstance.setClientRole(ClientRoleType.ClientRoleBroadcaster);

      // Enable video and audio
      engineInstance.enableVideo();
      engineInstance.enableAudio();

      // Set up event handlers
      engineInstance.addListener('onUserJoined', (connection, uid) => {
        console.log('UserJoined', uid);
        setPeerIds(prevPeerIds => {
          if (prevPeerIds.includes(uid)) {
            return prevPeerIds;
          }
          return [...prevPeerIds, uid];
        });
      });

      engineInstance.addListener('onUserOffline', (connection, uid) => {
        console.log('UserOffline', uid);
        setPeerIds(prevPeerIds => prevPeerIds.filter(id => id !== uid));
      });

      engineInstance.addListener('onJoinChannelSuccess', (connection, uid) => {
        console.log('JoinChannelSuccess', uid);
        setJoinSucceed(true);
        setLocalUid(uid);
      });

      engineInstance.addListener('onError', (err, msg) => {
        console.error('Agora error:', err, msg);
        Alert.alert('Error', `Video call error: ${msg}`);
      });

      setEngine(engineInstance);
      engineInstance.joinChannel('', channelName, '', 0);
    } catch (e) {
      console.error('Failed to initialize Agora:', e);
      Alert.alert('Error', 'Failed to initialize video call');
    }
  };

  const toggleMute = async () => {
    if (engine) {
      try {
        engine.muteLocalAudioStream(!isMuted);
        setIsMuted(!isMuted);
      } catch (e) {
        console.error('Failed to toggle mute:', e);
      }
    }
  };

  const toggleVideo = async () => {
    if (engine) {
      try {
        engine.enableLocalVideo(!isVideoEnabled);
        setIsVideoEnabled(!isVideoEnabled);
      } catch (e) {
        console.error('Failed to toggle video:', e);
      }
    }
  };

  const endCall = async () => {
    if (engine) {
      try {
        engine.leaveChannel();
        setPeerIds([]);
        setJoinSucceed(false);
        navigation.goBack();
      } catch (e) {
        console.error('Failed to end call:', e);
      }
    }
  };

  const renderVideos = () => {
    return (
      <View style={styles.fullView}>
        {isVideoEnabled && joinSucceed && (
          <View style={styles.localVideo}>
            <RtcSurfaceView
              style={styles.video}
              canvas={{
                uid: localUid,
                renderMode: RenderModeType.RenderModeFit,
              }}
            />
          </View>
        )}
        {peerIds.map(peerId => (
          <View key={peerId} style={styles.remoteVideo}>
            <RtcSurfaceView
              style={styles.video}
              canvas={{
                uid: peerId,
                renderMode: RenderModeType.RenderModeFit,
              }}
              zOrderMediaOverlay={true}
            />
          </View>
        ))}
      </View>
    );
  };

  const renderControls = () => {
    return (
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          onPress={toggleMute}
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}>
          <Icon
            name={isMuted ? 'microphone-off' : 'microphone'}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={endCall}
          style={[styles.controlButton, styles.endCallButton]}>
          <Icon name="phone-hangup" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleVideo}
          style={[
            styles.controlButton,
            !isVideoEnabled && styles.controlButtonActive,
          ]}>
          <Icon
            name={isVideoEnabled ? 'video' : 'video-off'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderVideos()}
      {renderControls()}
    </View>
  );
}

export default VideoCallScreen;
