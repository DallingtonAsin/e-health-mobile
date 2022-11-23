import React, {useRef, useState, useEffect} from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  RtcSurfaceView,
  ChannelProfileType,
} from 'react-native-agora';
import AppLoader from '../components/loaders/AppLoader';
import FocusAwareStatusBar from '../components/common/FocusAwareStatusBar';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AgoraUIKit from 'agora-rn-uikit';
import {AGORA_APP_ID, AGORA_CHANNEL_NAME, AGORA_TEMP_TOKEN} from '@env';
import * as colors from '../configs/colors';


const appId = AGORA_APP_ID;
const channelName = AGORA_CHANNEL_NAME;
const token = AGORA_TEMP_TOKEN;
const uid = 0;

const MeetingRoomScreen = () => {

    const agoraEngineRef = useRef(null); // Agora engine instance
    const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
    const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
    const [message, setMessage] = useState(''); // Message to the user
    const [isLoading, setIsLoading] = useState(false);
    const [videoCall, setVideoCall] = useState(false);
    const isDefaultApp = false;
  
    // const {colors} = useTheme();
    // const styles = makeStyles(colors);
  
    const connectionData = {
      appId: appId,
      channel: channelName,
      token: token,
    };
    
    const rtcCallbacks = {
      EndCall: () => setVideoCall(false),
    };
  
    const showMessage = (msg: string) => {
      setMessage(msg);
    };
  
    useEffect(() => {
      setupVideoSDKEngine();
    });
  
    const setupVideoSDKEngine = async () => {
      try {
        if (Platform.OS === 'android') {
          await getPermission();
        }
        agoraEngineRef.current = createAgoraRtcEngine();
        const agoraEngine = agoraEngineRef.current;
        agoraEngine.registerEventHandler({
          onJoinChannelSuccess: () => {
            showMessage('Successfully joined the channel ' + channelName);
            setIsJoined(true);
          },
          onUserJoined: (_connection, Uid) => {
            showMessage('Remote user joined with uid ' + Uid);
            setRemoteUid(Uid);
          },
          onUserOffline: (_connection, Uid) => {
            showMessage('Remote user left the channel. uid: ' + Uid);
            setRemoteUid(0);
          },
        });
        agoraEngine.initialize({
          appId: appId,
        });
        agoraEngine.enableVideo();
      } catch (e) {
        console.log(e);
      }
    };
  
    const getPermission = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
      }
    };


      return videoCall ? (
        <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
      ) : (
        <SafeAreaView style={styles.container}>
            <View style={styles.viewContainer}>
               <TouchableOpacity style={styles.joinButton}  onPress={() => setVideoCall(true)}>
                <Text style={styles.meetingText}>Join Meeting</Text>
               </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default MeetingRoomScreen;

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
    },
    viewContainer: {
        flex:1,
        justifyContent: 'center'
    },
    joinButton: {
        paddingHorizontal: 10,
        paddingVertical:10,
        marginHorizontal:25,
        backgroundColor: colors.default.primary,
        alignItems: 'center',
        borderRadius: 3,
    },
    meetingText: {
      color: colors.default.white,
      fontSize: 16,
    }
})