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
import { Avatar as AvatarRP } from 'react-native-paper'
import Avatar from '../../components/Avatar'
import { agoraConnectionInitialState } from '../../configs/constants'
import Icon5 from 'react-native-vector-icons/FontAwesome5'

const uid = Math.floor(Math.random() * 100000)
var isMuted = false

const AudioCallMeeting = ({ appointment_id }: { appointment_id: number }) => {

    const agoraEngineRef = useRef<IRtcEngine>()
    const [isJoined, setIsJoined] = useState(false)
    const [volume, setVolume] = useState(100)
    const [isVolumeUp, setIsVolumeUp] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isRatingVisible, setIsRatingVisible] = useState(false)
    const [ownUID, setOwnUID] = useState(uid)
    const [remoteUid, setRemoteUid] = useState(0)
    const [seconds, setSeconds] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [isRemoteUserMuted, setRemoteUserMuted] = useState(false)
    const [isOtherUserJoined, setIsOtherUserJoined] = useState(false)

    const [connectionData, setConnectionData] = useState<any>(agoraConnectionInitialState)
    const { getMeetingDetails, postCallDetails } = useContext(AppContext)
    const { postRating } = useContext(PatientContext)
    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['20%', '85%'], [])
    const { state } = useContext(AuthContext)
    const [user] = useState<IUser>(state.user)
    const [patient, setPatient] = useState<any>()
    const [doctor, setDoctor] = useState<any>()

    useEffect(() => {
        const requestPermissions = async () => {
            if (Platform.OS === 'android') { await requestAudioPermission() }
        }
        requestPermissions()
        getMeetingDetails({ appointmentId: appointment_id, onSuccess: setMeetingDetails, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
    }, [])

    useEffect(() => {
        let interval: any = null

        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1)
            }, 1000)
        } else {
            clearInterval(interval)
        }

        return () => clearInterval(interval)
    }, [isActive])

    const startTimer = () => {
        setIsActive(true)
    }

    const pauseTimer = () => {
        setIsActive(false)
    }

    const stopTimer = () => {
        setIsActive(false)
        setSeconds(0)
    }

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

    const submitCallDuration = () => {
        if ((doctor && doctor.id) && (patient && patient.id)) {

            let payload: any = {
                appointment_id: appointment_id,
                duration: seconds
            }

            if (user.is_patient) {
                payload.doctor_id = doctor.id
            }

            if (!user.is_patient) {
                payload.patient_id = patient.id
            }

            const is_patient: any = user.is_patient
            setIsLoading(true)
            postCallDetails({
                is_patient: is_patient, payload: payload, onSuccess: displayMessage, onFailure: displayMessage, onCompletion: () => {
                    setIsLoading(false)
                }
            })
        } else {
            displayMessage(`Unable to process request: no doc id`)
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
                        setIsJoined(true)
                    },
                    onUserJoined: async (_connection, Uid) => {
                        setRemoteUid(Uid)
                        if (Uid !== ownUID) {
                            setIsOtherUserJoined(true)
                        }
                    },
                    onUserOffline: (_connection, Uid) => {
                        setRemoteUid(0)
                        if (Uid !== ownUID) {
                            setIsOtherUserJoined(false)
                        }
                    },

                    onUserMuteAudio: (_connection, Uid, muted) => {
                        setRemoteUserMuted(muted)
                    }
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
            if (isJoined) {
                pauseTimer()
                Alert.alert(
                    `Confirm`,
                    'Are you sure you want to leave the call?',
                    [
                        { text: 'No', onPress: () => { } },
                        {
                            text: 'Yes', onPress: () => {
                                if (user.is_patient) {
                                    pauseTimer()
                                    setIsRatingVisible(true)
                                } else {
                                    leave()
                                    pauseTimer()
                                    submitCallDuration()
                                }
                            }
                        },
                    ],
                    { cancelable: false }
                )
            } else {

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
            }
        } catch (e) {
            console.log(e)
        }
    }

    const leave = () => {
        try {
            agoraEngineRef.current?.leaveChannel()
            pauseTimer()
            setRemoteUid(0)
            setIsJoined(false)
        } catch (e) {
            console.log(e)
        }
    }

    const mute = () => {
        isMuted = !isMuted
        agoraEngineRef.current?.muteLocalAudioStream(isMuted)
    }


    const handleCloseRating = () => {
        pauseTimer()
        setIsRatingVisible(false)
        leave()
        submitCallDuration()
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
                        submitCallDuration()
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
        <React.Fragment>
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

                        {
                            isJoined && isOtherUserJoined &&
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>{user.is_patient ? `${doctor.first_name}` : `${patient.first_name}`} is now on {isRemoteUserMuted ? 'mute': 'call'}</Text>
                                <Icon5 name={isRemoteUserMuted ? 'microphone-alt-slash' : 'microphone-alt'} size={20} color={isRemoteUserMuted ? config.colors.primary : config.colors.green_1} style={{ marginLeft: 4 }} />
                            </View>
                        }
                        {isJoined && !isOtherUserJoined && <Text>You are the only one here</Text>}

                        <TimerScreen seconds={seconds} />
                    </View>

                </ScrollView>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    backdropComponent={renderBackDrop}
                    onChange={handleSheetChanges}>
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
                            <CircularButton icon='phone-alt' size={20} onPress={() => join()} btnStyle={{ marginTop: 20 }} backgroundColor={isJoined ? config.colors.red : config.colors.green_1} />
                            <Text style={styles.controlText}>{(isJoined || isOtherUserJoined) ? 'stop call' : 'start call'}</Text>
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
                <RateDoctorPopup visible={isRatingVisible} onClose={handleCloseRating} onRatingSubmit={handleRatingSubmit} />

            </View>
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