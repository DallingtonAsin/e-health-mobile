import React, {  useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import { AGORA_APP_ID, AGORA_CHANNEL_NAME, AGORA_TEMP_TOKEN } from '@env';
import AppLoader from '../components/AppLoader';
import {createAgoraRtcEngine} from 'react-native-agora';

const appId = AGORA_APP_ID;
const channelName = AGORA_CHANNEL_NAME;
const token = AGORA_TEMP_TOKEN;

const MeetingRoomScreen = ({ videoCall, is_video, setVideoCall }: { videoCall: boolean, is_video:boolean, setVideoCall: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [message, setMessage] = useState('');

  const connectionData = {
    appId: appId,
    channel: channelName,
    token: token,
  };

  const agoraEngine = createAgoraRtcEngine();
  agoraEngine.initialize({
    appId: appId,
  });

  const rtcCallbacks = {
    EndCall: () => setVideoCall(false),
  };

  // const showMessage = (msg: string) => {
  //   setMessage(msg);
  // };

  // useEffect(() => {
  //   setupVideoSDKEngine();
  // }, []);

  // const setupVideoSDKEngine = async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       await getPermission();
  //     }
  
  //     agoraEngine.registerEventHandler({
  //       onJoinChannelSuccess: () => {
  //         showMessage('Successfully joined the channel ' + channelName);
  //         setIsJoined(true);
  //       },
  //       onUserJoined: (_connection: any, Uid: any) => {
  //         showMessage('Remote user joined with uid ' + Uid);
  //         setRemoteUid(Uid);
  //       },
  //       onUserOffline: (_connection: any, Uid: any) => {
  //         showMessage('Remote user left the channel. uid: ' + Uid);
  //         setRemoteUid(0);
  //       },
  //     });
  //     console.log(`is video`, is_video);
  //     if(is_video){
  //       console.log(`Video loading...`);
  //       agoraEngine.enableVideo();
  //     }else{
  //       console.log(`Audio loading...`);
  //       agoraEngine.enableAudio();
  //     }

  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
  };


  return videoCall
    ? <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
    : <AppLoader />

}

export default MeetingRoomScreen;