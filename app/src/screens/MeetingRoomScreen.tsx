import React, { useState, useEffect, useContext } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import AppLoader from '../components/AppLoader';
import { createAgoraRtcEngine, isDebuggable } from 'react-native-agora';
import { Context as AppContext } from '../context/appContext';
import { displayMessage } from '../components/common/SharedHelper';


const MeetingRoomScreen = ({ appointment_id, videoCall, setVideoCall }: { appointment_id: number, videoCall: boolean, setVideoCall: React.Dispatch<React.SetStateAction<boolean>>  }) => {

  const [connectionData, setConnectionData] = useState<any>()

  const { getMeetingDetails } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const agoraEngine = createAgoraRtcEngine();

  useEffect(() => {
    getMeetingDetails({ appointmentId: appointment_id, onSuccess: populateConnectionData, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } });

    if(connectionData && connectionData.appId){
      agoraEngine.initialize({
        appId: connectionData.appId
      });
    }

  }, [connectionData]);

  const rtcCallbacks = {
    EndCall: () => setVideoCall(false),
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

}

export default MeetingRoomScreen;