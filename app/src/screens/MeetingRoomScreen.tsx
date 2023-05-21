import React, { useState, useEffect, useContext } from 'react';
import { View, Button, Alert, PermissionsAndroid, Platform } from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import AppLoader from '../components/AppLoader';
import RtcEngine, { createAgoraRtcEngine } from 'react-native-agora';
import { Context as AppContext } from '../context/appContext';
import { displayMessage } from '../components/common/SharedHelper';
import { Rating, AirbnbRating } from 'react-native-ratings';

const MeetingRoomScreen = ({ appointment_id, videoCall, setVideoCall }: { appointment_id: number, videoCall: boolean, setVideoCall: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const [connectionData, setConnectionData] = useState<any>()
  const [rtcEngine, setRtcEngine] = useState<typeof RtcEngine | null>(null);
  const [channelName, setChannelName] = useState('');
  const { getMeetingDetails } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const agoraEngine = createAgoraRtcEngine();



const showRatingAlert = (rating: number) => {
  Alert.alert(
    'Rate this App',
    'How would you rate this app?',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Submit', onPress: () => submitRating() },
    ],
  );
};

const submitRating = () => {

}

  useEffect(() => {

    getMeetingDetails({ appointmentId: appointment_id, onSuccess: populateConnectionData, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } });

    if (connectionData && connectionData.appId) {
      agoraEngine.initialize({
        appId: connectionData.appId
      });

      // Enable video module
      agoraEngine.enableVideo();
  
      // Enable audio module
      agoraEngine.enableAudio();

        // Join the channel
    agoraEngine.joinChannel(connectionData.appId, 'Telecmedicine', 778788, {});
  
    }

  



    return () => {
      // Clean up resources
      // agoraEngine?.destroy();
    };
  }, []);


   // Event handler for user joined the channel
   const handleUserJoined = (uid: number) => {
    // Handle the logic when a user joins the channel
    console.log('User joined:', uid);
  };

  // Event handler for user offline
  const handleUserOffline = (uid: number, reason: number) => {
    // Handle the logic when a user goes offline
    console.log('User offline:', uid, reason);
  };

   // Start the live streaming
   const startStreaming = () => {
    agoraEngine?.startPreview();
  };

  // End the live streaming
  const endStreaming = () => {
    agoraEngine?.stopPreview();
  };

  const rtcCallbacks = {
    EndCall: () => {
      Alert.alert(
        `Confirm`,
        'Are you sure you want to hang up the call?',
        [
          { text: 'No', onPress: () => { } },
          {
            text: 'Yes', onPress: () => {
              setVideoCall(false)
            }
          },
        ],
        { cancelable: false }
      );

    },
    
  }


  const populateConnectionData = (data: any) => {
    setConnectionData(data);
  }

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };

  if (isLoading) {
    return <AppLoader />
  }

  return videoCall ? <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} /> : <AppLoader />
  return (
    <View>
      <Button title="Start Streaming" onPress={startStreaming} />
      <Button title="End Streaming" onPress={endStreaming} />
    </View>
  );
}

export default MeetingRoomScreen;