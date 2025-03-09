import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullView: {
    flex: 1,
  },
  localVideo: {
    position: 'absolute',
    right: 20,
    top: 40,
    width: 100,
    height: 150,
    zIndex: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  remoteVideo: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  controlButtonActive: {
    backgroundColor: '#FF4444',
  },
  endCallButton: {
    backgroundColor: '#FF4444',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});

export default styles;