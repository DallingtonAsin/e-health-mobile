import React, { useRef, useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, Alert, View } from 'react-native'
import { Platform } from 'react-native'
import {
    ClientRoleType,
    createAgoraRtcEngine,
    IRtcEngine,
    ChannelProfileType,
} from 'react-native-agora'
import { CircularButton } from '../../components/common/buttons'
import AppLoader from '../../components/AppLoader'
import RateDoctorPopup from '../../components/RateDoctorPopup'
import { requestAudioPermission } from '../../components/common/Permissions'
import { Context as AppContext } from '../../context/appContext'
import { displayMessage, getUserInitials, toastShortMessage } from '../../components/common/SharedHelper'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Divider } from 'react-native-paper'
import * as config from '../../configs'
import { Context as AuthContext } from '../../context/authContext'
import { Context as PatientContext } from '../../context/patientContext'
import { DoctorsDetail, IUser } from '../../interfaces'
import { useNavigation } from '@react-navigation/native'
import TimerScreen from '../../components/common/TimerScreen'
import { Avatar as AvatarRP } from 'react-native-paper';
import Avatar from '../../components/Avatar';


interface AgoraConnectionProps {
    appId: string,
    token: string,
    channel: string
}
var isMuted = false

const uid = Math.floor(Math.random() * 100000);

const AudioCallMeeting = ({ appointment_id, doctor, patient }: { appointment_id: number, doctor: DoctorsDetail, patient: any }) => {

    const agoraEngineRef = useRef<IRtcEngine>()
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [isJoined, setIsJoined] = useState<boolean>(false)
    // const [isMuted, setIsMuted] = useState<boolean>(false)
    const [volume, setVolume] = useState<number>(100)
    const [isVolumeUp, setIsVolumeUp] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isRatingVisible, setIsRatingVisible] = useState<boolean>(false)
    const [ownUID, setOwnUID] = useState<number>(uid);
    const [remoteUid, setRemoteUid] = useState(0)
    const [isOtherUserJoined, setIsOtherUserJoined] = useState(false);
  

    const [timer, setTimer] = useState<number>(0)
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)
    const [interval, setIntervalId] = useState<any | null>(null)
    const [connectionData, setConnectionData] = useState<AgoraConnectionProps>({ appId: '', channel: '', token: '' })
    const { getMeetingDetails } = useContext(AppContext)
    const { postRating } = useContext(PatientContext)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['20%', '85%'], [])
    const { state } = useContext(AuthContext)
    const [user] = useState<IUser>(state.user)
    const navigation = useNavigation()

    const showMessage = (msg: string) => {
        setMessage(msg)
    }

    const startTimer = (): void => {
        setIsTimerRunning(true)
    }

    const stopTimer = (): void => {
        setIsTimerRunning(false)
        setTimer(0)
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({ title: 'AudioCall Room' });
      }, [navigation]);

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

    useEffect(() => {
        const requestPermissions = async() => {
            if (Platform.OS === 'android') { await requestAudioPermission() }
        }
        requestPermissions()
        getMeetingDetails({ appointmentId: appointment_id, onSuccess: setConnectionData, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
    }, [])

    useEffect(() => {
        setupVoiceSDKEngine()
    })

    const setupVoiceSDKEngine = async () => {
        try {

            agoraEngineRef.current = createAgoraRtcEngine()
            const agoraEngine = agoraEngineRef.current

            // if (connectionData && connectionData.channel) {
            agoraEngine.registerEventHandler({
                onJoinChannelSuccess: () => {
                    // showMessage('Successfully joined the meeting channel ' + connectionData.channel)
                    setIsConnected(true)
                },
                onUserJoined: (_connection, Uid) => {
                    showMessage('Remote user joined with uid ' + Uid)
                    setRemoteUid(Uid)
                    if(Uid !== ownUID){
                        setIsOtherUserJoined(true);
                    }
                },
                onUserOffline: (_connection, Uid) => {
                    showMessage('Remote user left the channel. uid: ' + Uid)
                    setRemoteUid(0)
                    if(Uid !== ownUID){
                        setIsOtherUserJoined(false);
                    }
                },
            })

            agoraEngine.initialize({
                appId: connectionData.appId
            })

            // }

        } catch (e) {
            console.log(`Unable to initialize agora engine`, e)
        }
    }

    const increaseVolume = () => {
        if (volume !== 100) {
            setVolume(volume + 5)
        }
        toastShortMessage(volume.toString())
        agoraEngineRef.current?.adjustRecordingSignalVolume(volume)
    }

    const decreaseVolume = () => {
        if (volume !== 0) {
            setVolume(volume - 5)
        }
        toastShortMessage(volume.toString())
        agoraEngineRef.current?.adjustRecordingSignalVolume(volume)
    }

    const join = async () => {

        if (isConnected && isJoined) {
            stopTimer()
            Alert.alert(
                `Confirm`,
                'Are you sure you want to leave the call?',
                [
                    { text: 'No', onPress: () => { } },
                    {
                        text: 'Yes', onPress: () => {
                            if (user.is_patient) {
                                setIsRatingVisible(true)
                            } else {
                                leave()
                                // navigation.navigate('MyAppointments')
                            }
                        }
                    },
                ],
                { cancelable: false }
            )
        }
        try {
            agoraEngineRef.current?.setChannelProfile(
                ChannelProfileType.ChannelProfileCommunication,
            )
            // agoraEngineRef.current?.muteLocalAudioStream(isMuted)

            if (connectionData && connectionData.appId && ownUID) {

                agoraEngineRef.current?.joinChannel(connectionData.token, connectionData.channel, ownUID, {
                    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                })
                // agoraEngineRef.current?.muteLocalAudioStream(isMuted)
                startTimer()
                setIsJoined(true)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const leave = () => {
        try {
            agoraEngineRef.current?.leaveChannel()
            stopTimer()
            setRemoteUid(0)
            setIsConnected(false)
            setIsJoined(false)
            showMessage('You left the channel')
        } catch (e) {
            console.log(e)
        }
    }

    const handleCloseRating = () => {
        stopTimer()
        setIsRatingVisible(false)
        leave()
        // navigation.navigate('MyAppointments')
    }

    const handleRatingSubmit = (rating: number, comment: string) => {
        if (rating > 0) {
            const payload = {
                doctor_id: doctor.id,
                rating: rating,
                comment: comment
            }
            postRating({
                payload: payload, onSuccess: displayMessage, onFailure: displayMessage, onCompletion: () => {
                    setIsRatingVisible(false)
                    leave()
                }
            })
        } else {
            displayMessage(`Rate doctor with atleast one star`)
        }
    }

    const renderBackDrop = useCallback((props: any) => (<BottomSheetBackdrop {...props} opacity={0.2} />), [])

    const handleSheetChanges = useCallback((index: number) => {
        bottomSheetRef.current?.snapToIndex(index)
    }, [])


    const muteCall = () => {
        isMuted = !isMuted;
        agoraEngineRef.current?.muteLocalAudioStream(isMuted)
    }

    return (
        <React.Fragment>
            <View style={styles.main}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}>

                    <View style={styles.centeredContent}>
                        {user.is_patient && (doctor.thumbnail && <Avatar size={95} source={doctor.thumbnail} />)}
                        {!user.is_patient && (patient.thumbnail && <Avatar size={95} source={patient.thumbnail} />)}

                        {user.is_patient && !doctor.thumbnail && <AvatarRP.Text size={95} label={getUserInitials(`${doctor.first_name} ${doctor.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.5, borderColor: config.colors.gray }]} />}
                        {!user.is_patient && !patient.thumbnail && <AvatarRP.Text size={95} label={getUserInitials(`${patient.first_name} ${patient.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.5, borderColor: config.colors.gray }]} />}

                        {user.is_patient && <Text style={styles.name}>{doctor.first_name}</Text>}
                        {!user.is_patient && <Text style={styles.name}>{patient.first_name}</Text>}

                        {/* {isJoined && <Text>Local user uid: {uid}</Text>} */}
                        {!isJoined && <Text>Start a call</Text>}


                        {isJoined && isOtherUserJoined ? (
                            <>
                                {user.is_patient && <Text>{doctor.first_name} is now on call</Text>}
                                {!user.is_patient && <Text>{patient.first_name} is now on call</Text>}
                            </>
                        ) : (
                            <>
                                {user.is_patient && isJoined && !isOtherUserJoined && <Text>Waiting for doctor {doctor.first_name} to join</Text>}
                                {!user.is_patient &&  isJoined && !isOtherUserJoined && <Text>Waiting for {patient.first_name} to join</Text>}
                            </>
                        )}
                        {/* <Text>{message}</Text> */}

                        <TimerScreen timer={timer} />
                    </View>

                </ScrollView>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    backdropComponent={renderBackDrop}
                    onChange={handleSheetChanges}
                >
                    <Divider style={styles.divider} />
                    <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
                        <CircularButton icon='volume-down' size={25} onPress={decreaseVolume} iconColor={config.colors.gray} backgroundColor={isVolumeUp ? config.colors.silver : config.colors.white} btnStyle={{ marginTop: 20 }} />
                        <CircularButton icon='volume-up' size={22} onPress={increaseVolume} iconColor={config.colors.gray} backgroundColor={isVolumeUp ? config.colors.silver : config.colors.white} btnStyle={{ marginTop: 20 }} />
                        <CircularButton icon='microphone-alt-slash' size={20} onPress={muteCall} iconColor={config.colors.gray} backgroundColor={isMuted ? config.colors.silver : config.colors.white} btnStyle={{ marginTop: 20 }} />
                        <CircularButton icon='phone-alt' size={20} onPress={join} btnStyle={{ marginTop: 20 }} />
                    </BottomSheetScrollView>
                </BottomSheet>
                <RateDoctorPopup visible={isRatingVisible} onClose={handleCloseRating} onRatingSubmit={handleRatingSubmit} />

            </View>
            {isLoading && <AppLoader />}
        </React.Fragment>
    )
}

export default AudioCallMeeting

const styles = StyleSheet.create({

    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollContainer: {
        flexGrow: 1,
    },

    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 400
    },

    contentContainer: {
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },

    head: {
        fontSize: 20
    },

    divider: {
        borderBottomColor: '#e2e2e2',
        borderBottomWidth: 1,
        marginTop: 20
    },

    bottomSheet: {
        backgroundColor: config.colors.audioCallbg
    },

    name: {
        fontSize: 22,
        // fontWeight: '700',
        color: config.colors.dark
    }

})