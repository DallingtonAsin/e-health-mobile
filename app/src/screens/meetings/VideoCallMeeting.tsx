import React, { useState, useEffect, useContext, useRef } from 'react'
import { ScrollView, SafeAreaView, StyleSheet, Text, Alert, View, PermissionsAndroid, Platform } from 'react-native'
import AgoraUIKit from 'agora-rn-uikit'
import AppLoader from '../../components/AppLoader'
import { Context as AppContext } from '../../context/appContext'
import { Context as PatientContext } from '../../context/patientContext'
import { displayMessage, getUserInitials } from '../../components/common/SharedHelper'
import RateDoctorPopup from '../../components/RateDoctorPopup'
import { Context as AuthContext } from '../../context/authContext'
import { IUser } from '../../interfaces'
import { BottomRightButton, CircularButton } from '../../components/common/buttons'
import TimerScreen from '../../components/common/TimerScreen'
import { Avatar as AvatarRP } from 'react-native-paper';
import Avatar from '../../components/Avatar';
import * as config from '../../configs'
import { agoraConnectionInitialState } from '../../configs/constants'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'
import {
    ClientRoleType,
    createAgoraRtcEngine,
    IRtcEngine,
    RtcSurfaceView,
    ChannelProfileType,
} from 'react-native-agora';
import StickerWithText from '../../components/StickerWithText'
const uid = Math.floor(Math.random() * 100000);
var isMuted = false;

const VideoCallMeeting = ({ appointment_id }: { appointment_id: number }) => {

    const { postRating } = useContext(PatientContext)
    const { state } = useContext(AuthContext)
    const [user] = useState<IUser>(state.user)
    const [connectionData, setConnectionData] = useState<any>(agoraConnectionInitialState)
    const { getMeetingDetails } = useContext(AppContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isRatingVisible, setIsRatingVisible] = useState(false)
    const agoraEngine = createAgoraRtcEngine()
    const [videoCall, setVideoCall] = useState(false)
    const [patient, setPatient] = useState<any>()
    const [doctor, setDoctor] = useState<any>()
    const [timer, setTimer] = useState(0)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [interval, setIntervalId] = useState<any | null>(null)
    const [ownUID, setOwnUID] = useState(uid);
    const agoraEngineRef = useRef<IRtcEngine>();
    const [isJoined, setIsJoined] = useState(false);
    const [remoteUid, setRemoteUid] = useState(0);
    const [message, setMessage] = useState('');
    const [isOtherUserJoined, setIsOtherUserJoined] = useState(false);

    useEffect(() => {
        getMeetingDetails({ appointmentId: appointment_id, onSuccess: setMeetingDetails, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
        if (connectionData && connectionData.appId) {
            agoraEngine.initialize({
                appId: connectionData.appId
            })
        }
    }, [])

    function showMessage(msg: string) {
        setMessage(msg);
    }

    const getPermission = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.CAMERA,
            ]);
        }
    };

    useEffect(() => {
        setupVideoSDKEngine();
    });

    const setupVideoSDKEngine = async () => {
        try {
            if (Platform.OS === 'android') { await getPermission() };
            agoraEngineRef.current = createAgoraRtcEngine();
            const agoraEngine = agoraEngineRef.current;

            if (connectionData && connectionData.channel) {
                agoraEngine.registerEventHandler({
                    onJoinChannelSuccess: () => {
                        showMessage('Successfully joined the channel ' + connectionData.channel);
                        setIsJoined(true);
                    },
                    onUserJoined: (_connection, Uid) => {
                        showMessage('Remote user joined with uid ' + Uid);
                        setRemoteUid(Uid);
                        if (Uid !== ownUID) {
                            setIsOtherUserJoined(true);
                        }
                    },
                    onUserOffline: (_connection, Uid) => {
                        showMessage('Remote user left the channel. uid: ' + Uid);
                        setRemoteUid(0);
                        if (Uid !== ownUID) {
                            setIsOtherUserJoined(false);
                        }
                    },
                });
                agoraEngine.initialize({
                    appId: connectionData.appId,
                    channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
                });
                agoraEngine.enableVideo();
            }
        } catch (e) {
            console.log(e);
        }
    };

    const join = async () => {
        if (isJoined) {
            return;
        }
        try {
            agoraEngineRef.current?.setChannelProfile(
                ChannelProfileType.ChannelProfileCommunication,
            );
            agoraEngineRef.current?.startPreview();
            if (connectionData && connectionData.appId && ownUID) {
                agoraEngineRef.current?.joinChannel(connectionData.token, connectionData.channel, ownUID, {
                    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    const leave = () => {
        try {

            Alert.alert(
                `Confirm`,
                'Are you sure you want to leave the call?',
                [
                    { text: 'No', onPress: () => { } },
                    {
                        text: 'Yes', onPress: () => {
                            if (user.is_patient) {
                                stopTimer()
                                setIsRatingVisible(true)
                            } else {
                                leaveChannel()
                                stopTimer()
                            }
                        }
                    },
                ],
                { cancelable: false }
            )


        } catch (e) {
            console.log(e);
        }
    };

    const leaveChannel = () => {
        agoraEngineRef.current?.leaveChannel();
        setRemoteUid(0);
        setIsJoined(false);
        showMessage('You left the channel');
    }

    const mute = () => {
        isMuted = !isMuted;
        agoraEngineRef.current?.muteLocalAudioStream(isMuted);
    };

    const setMeetingDetails = (data: any) => {
        if (data && data.meeting_access) {
            setConnectionData(data.meeting_access)
        }
        if (data && data.patient) {
            setPatient(data.patient)
        }
        if (data && data.doctor) {
            setDoctor(data.doctor)
        }
    }

    const handleCloseRating = () => {
        setIsRatingVisible(false)
        leaveChannel()
    }

    const handleRatingSubmit = (rating: number, comment: string) => {
        if (rating > 0) {
            if (doctor && doctor.id) {
                const payload = {
                    doctor_id: doctor.id,
                    rating: rating,
                    comment: comment
                }
                postRating({
                    payload: payload, onSuccess: displayMessage, onFailure: displayMessage, onCompletion: () => {
                        setIsRatingVisible(false)
                        leaveChannel()
                    }
                })
            } else {
                displayMessage(`Unable to process request: no doc id`)
            }
        } else {
            displayMessage(`Rate doctor with atleast one star`)
        }
    }

    const startTimer = (): void => {
        setIsTimerRunning(true)
    }

    const stopTimer = (): void => {
        setIsTimerRunning(false)
        setTimer(0)
    }

    useEffect(() => {
        if (isTimerRunning) {
            const id = setInterval(() => {
                setTimer((prevTimer: any) => prevTimer + 1)
            }, 1000)
            setIntervalId(id)
        } else {
            if (interval) {
                clearInterval(interval)
            }
            setIntervalId(null)
        }
        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isTimerRunning])

    const startCall = () => {
        startTimer()
        join()
    }

    if (isLoading) {
        return <AppLoader />
    }

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainer}>
                {isJoined ? (
                    <React.Fragment key={0}>

                        {/* {isJoined && isOtherUserJoined && <View style={styles.header}><Animatable.Text >{user.is_patient ? `${doctor.first_name}` : `${patient.first_name}`} is now on call</Animatable.Text ></View>} */}
                        {isJoined && !isOtherUserJoined && <View style={styles.header}><Animatable.Text animation="pulse" iterationCount={"infinite"} easing="ease-out" style={styles.info}><Icon name="info-circle" size={18} color={config.colors.primaryBlue} /> You are the only one here</Animatable.Text ></View>}

                        {isJoined && !isOtherUserJoined && <RtcSurfaceView canvas={{ uid: 0 }} style={styles.videoView} />}
                        {/* {isJoined && remoteUid !== 0 && <RtcSurfaceView canvas={{ uid: remoteUid }} style={styles.videoView} />} */}

                        {isJoined && remoteUid !== 0 ? (
                    <React.Fragment key={remoteUid}>
                        <RtcSurfaceView
                            canvas={{ uid: remoteUid }}
                            style={styles.videoView}
                        />
                        <Text>Remote user uid: {remoteUid}</Text>
                    </React.Fragment>
                ) : (
                    <Text>Waiting for a remote user to join</Text>
                )}

                        <View style={styles.btnContainer}>
                            <View style={styles.contentContainer}>
                                <View style={styles.controls}>
                                    <CircularButton icon={isMuted ? 'microphone-alt-slash' : 'microphone-alt'} size={20} onPress={mute} btnStyle={{ marginTop: 20 }} backgroundColor={config.colors.paleBlue1} />
                                    <Text style={styles.controlText}>Audio</Text>
                                </View>

                                <View style={styles.controls}>
                                    <CircularButton icon='video' size={20} onPress={startCall} btnStyle={{ marginTop: 20 }} backgroundColor={config.colors.paleBlue1} />
                                    <Text style={styles.controlText}>Video</Text>
                                </View>

                                <View style={styles.controls}>
                                    <CircularButton icon='video' size={20} onPress={startCall} btnStyle={{ marginTop: 20 }} backgroundColor={config.colors.paleBlue1} />
                                    <Text style={styles.controlText}>Switch</Text>
                                </View>

                                <View style={styles.controls}>
                                    <CircularButton icon='phone-alt' size={20} onPress={leave} btnStyle={{ marginTop: 20 }} backgroundColor={config.colors.red} />
                                    <Text style={styles.controlText}>Hang Up</Text>
                                </View>
                            </View>
                        </View>



                    </React.Fragment>
                ) : (
                    <View style={styles._main}>
                        <ScrollView contentContainerStyle={styles._scrollContainer}>
                            <View style={styles.centeredContent}>
                                {user.is_patient && (doctor && doctor.thumbnail && <Avatar size={95} source={doctor.thumbnail} />)}
                                {!user.is_patient && (patient && patient.thumbnail && <Avatar size={95} source={patient.thumbnail} />)}

                                {user.is_patient && doctor && !doctor.thumbnail && <AvatarRP.Text size={95} label={getUserInitials(`${doctor.first_name} ${doctor.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.2, borderColor: config.colors.gray }]} />}
                                {!user.is_patient && patient && !patient.thumbnail && <AvatarRP.Text size={95} label={getUserInitials(`${patient.first_name} ${patient.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.2, borderColor: config.colors.gray }]} />}

                                {!videoCall && <Text>Start video call with
                                    {user.is_patient && doctor && <Text> {doctor.first_name}</Text>}
                                    {!user.is_patient && patient && <Text> {patient.first_name}</Text>}
                                </Text>}
                                <TimerScreen timer={timer} />
                            </View>
                        </ScrollView>
                        <View style={styles.controls}>
                            <BottomRightButton icon={"video"} size={20} btnStyle={{ right: 8 }} onPress={() => startCall()} />
                            <Text style={[styles.controlText, { color: config.colors.gray }]}>{videoCall ? 'Stop video' : 'Start video'}</Text>
                        </View>
                    </View>
                )}




            </ScrollView>
            <RateDoctorPopup visible={isRatingVisible} onClose={handleCloseRating} onRatingSubmit={handleRatingSubmit} />
        </SafeAreaView>
    );

}

export default VideoCallMeeting

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: config.colors.white,
    },

    header: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    body: {
        flex: 1,
        backgroundColor: config.colors.white,
        height: '100%'
    },

    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 400
    },

    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 25,
    },

    divider: {
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: 1,
        marginTop: 20
    },

    bottomSheet: {
        backgroundColor: config.colors.audioCallbg
    },

    controls: {
        alignItems: 'center',
        bottom: 25
    },

    controlText: {
        textAlign: 'center',
        textTransform: 'capitalize',
        fontSize: config.fonts.medium,
        color: config.colors.white,
    },

    infoText: {
        textAlign: 'center',
        fontSize: config.fonts.medium,

    },

    button: {
        paddingHorizontal: 25,
        paddingVertical: 4,
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#0055cc',
        margin: 5,
    },

    main: {
        flex: 1,
        alignItems: 'center',
        color: config.colors.white,
    },
    scroll: {
        flex: 1,
        backgroundColor: '#ddeeff',
        width: '100%'
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center'
    },
    videoView: {
        width: '100%',
        height: 650
    },
    btnContainer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        marginBottom: 0,
        justifyContent: 'space-between',
    },
    head: {
        fontSize: 20
    },
    info: {
        color: config.colors.primaryBlue,
        textAlign: 'center',
        fontSize: config.fonts.medium,
    },

    _main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    _scrollContainer: {
        flexGrow: 1,
    },

    stickerContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
    },

})