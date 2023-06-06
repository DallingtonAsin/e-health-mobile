import React, { useRef, useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { ScrollView, StyleSheet, Text, Alert, View } from 'react-native'
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
import { IUser } from '../../interfaces'
import TimerScreen from '../../components/common/TimerScreen'
import { Avatar as AvatarRP } from 'react-native-paper';
import Avatar from '../../components/Avatar';
import { agoraConnectionInitialState } from '../../configs/constants'
const uid = Math.floor(Math.random() * 100000);
var isMuted = false

const AudioCallMeeting = ({ appointment_id }: { appointment_id: number }) => {

    const agoraEngineRef = useRef<IRtcEngine>()
    const [isConnected, setIsConnected] = useState(false)
    const [isJoined, setIsJoined] = useState(false)
    const [volume, setVolume] = useState(100)
    const [isVolumeUp, setIsVolumeUp] = useState(false)
    const [message, setMessage] = useState<string | any>('')
    const [isLoading, setIsLoading] = useState(true)
    const [isRatingVisible, setIsRatingVisible] = useState(false)
    const [ownUID, setOwnUID] = useState(uid);
    const [remoteUid, setRemoteUid] = useState(0)
    const [isOtherUserJoined, setIsOtherUserJoined] = useState(false);

    const [timer, setTimer] = useState(0)
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [interval, setIntervalId] = useState<any | null>(null)
    const [connectionData, setConnectionData] = useState<any>(agoraConnectionInitialState)
    const { getMeetingDetails } = useContext(AppContext)
    const { postRating } = useContext(PatientContext)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['20%', '85%'], [])
    const { state } = useContext(AuthContext)
    const [user] = useState<IUser>(state.user)
    const [patient, setPatient] = useState<any>()
    const [doctor, setDoctor] = useState<any>()


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
        const requestPermissions = async () => {
            if (Platform.OS === 'android') { await requestAudioPermission() }
        }
        requestPermissions()
        getMeetingDetails({ appointmentId: appointment_id, onSuccess: setMeetingDetails, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
    }, [])

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

    useEffect(() => {
        setupVoiceSDKEngine()
    })

    const setupVoiceSDKEngine = async () => {
        try {

            agoraEngineRef.current = createAgoraRtcEngine()
            const agoraEngine = agoraEngineRef.current

            if (connectionData && connectionData.channel) {
                agoraEngine.registerEventHandler({
                    onJoinChannelSuccess: () => {
                        setIsConnected(true)
                    },
                    onUserJoined: (_connection, Uid) => {
                        showMessage('Remote user joined with uid ' + Uid)
                        setRemoteUid(Uid)
                        if (Uid !== ownUID) {
                            setIsOtherUserJoined(true);
                        }
                    },
                    onUserOffline: (_connection, Uid) => {
                        showMessage('Remote user left the channel. uid: ' + Uid)
                        setRemoteUid(0)
                        if (Uid !== ownUID) {
                            setIsOtherUserJoined(false);
                        }
                    },
                })

                agoraEngine.initialize({
                    appId: connectionData.appId
                })
            }

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

        try {
            if (isConnected || isJoined) {
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
                                }
                            }
                        },
                    ],
                    { cancelable: false }
                )
            }
            agoraEngineRef.current?.setChannelProfile(
                ChannelProfileType.ChannelProfileCommunication,
            )

            if (connectionData && connectionData.appId && ownUID) {

                agoraEngineRef.current?.joinChannel(connectionData.token, connectionData.channel, ownUID, {
                    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                })
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

    const mute = () => {
        isMuted = !isMuted;
        agoraEngineRef.current?.muteLocalAudioStream(isMuted)
    }


    const handleCloseRating = () => {
        stopTimer()
        setIsRatingVisible(false)
        leave()
    }

    const handleRatingSubmit = (rating: number, comment: string) => {
        try {
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
        } catch (err) {
            console.log(`err`, err)
        }
    }

    const renderBackDrop = useCallback((props: any) => (<BottomSheetBackdrop {...props} opacity={0.2} />), [])

    const handleSheetChanges = useCallback((index: number) => {
        bottomSheetRef.current?.snapToIndex(index)
    }, [])


    if (isLoading) {
        return <AppLoader />
    }

    return (
        <>
            <View style={styles.main}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.centeredContent}>
                        {user.is_patient && (doctor && doctor.thumbnail && <Avatar size={95} source={doctor.thumbnail} />)}
                        {!user.is_patient && (patient && patient.thumbnail && <Avatar size={95} source={patient.thumbnail} />)}

                        {user.is_patient && doctor && !doctor.thumbnail && <AvatarRP.Text size={95} label={getUserInitials(`${doctor.first_name} ${doctor.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.2, borderColor: config.colors.gray }]} />}
                        {!user.is_patient && patient && !patient.thumbnail && <AvatarRP.Text size={95} label={getUserInitials(`${patient.first_name} ${patient.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.2, borderColor: config.colors.gray }]} />}

                        {user.is_patient && doctor && <Text style={styles.name}>{doctor.first_name}</Text>}
                        {!user.is_patient && patient && <Text style={styles.name}>{patient.first_name}</Text>}
                        {!isJoined && <Text>Start a call</Text>}

                        {isJoined && isOtherUserJoined && <Text>{user.is_patient ? `${doctor.first_name}` : `${patient.first_name}`} is now on call</Text>}
                        {isJoined && !isOtherUserJoined && <Text>You are the only one here</Text>}
                        
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
                        <View style={styles.controls}>
                            <CircularButton icon='volume-down' size={30} onPress={() => decreaseVolume()} iconColor={config.colors.gray} backgroundColor={isVolumeUp ? config.colors.silver : config.colors.white} btnStyle={{ marginTop: 20 }} />
                            <Text style={styles.controlText}>Volume down</Text>
                        </View>
                        <View style={styles.controls}>
                            <CircularButton icon='volume-up' size={25} onPress={() => increaseVolume()} iconColor={config.colors.gray} backgroundColor={isVolumeUp ? config.colors.silver : config.colors.white} btnStyle={{ marginTop: 20 }} />
                            <Text style={styles.controlText}>Volume up</Text>
                        </View>
                        <View style={styles.controls}>
                            <CircularButton icon='microphone-alt-slash' size={25} onPress={() => mute()} iconColor={config.colors.gray} backgroundColor={isMuted ? config.colors.silver : config.colors.white} btnStyle={{ marginTop: 20 }} />
                            <Text style={styles.controlText}>Mute</Text>
                        </View>
                        <View style={styles.controls}>
                            <CircularButton icon='phone-alt' size={20} onPress={() => join()} btnStyle={{ marginTop: 20 }} />
                            <Text style={styles.controlText}>{(isConnected || isJoined || isOtherUserJoined) ? 'stop call' : 'start call'}</Text>
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
                <RateDoctorPopup visible={isRatingVisible} onClose={handleCloseRating} onRatingSubmit={handleRatingSubmit} />

            </View>
        </>
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
        justifyContent: 'space-between',
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
        color: config.colors.dark
    },

    controls: {
        alignItems: 'center'
    },

    controlText: {
        textAlign: 'center',
        textTransform: 'lowercase',
        fontSize: config.fonts.medium
    }
})