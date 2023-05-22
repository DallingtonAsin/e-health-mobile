import React, { useRef, useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Alert } from 'react-native'
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
import { displayMessage, toastShortMessage } from '../../components/common/SharedHelper'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Divider } from 'react-native-paper'
import * as config from '../../configs'
import { Context as AuthContext } from '../../context/authContext'
import { Context as PatientContext } from '../../context/patientContext'
import { IUser } from '../../interfaces'
import { useNavigation } from '@react-navigation/native';

const uid = 0

const AudioCallMeeting = ({ appointment_id, doctor_id }: { appointment_id: number, doctor_id: number }) => {

    const agoraEngineRef = useRef<IRtcEngine>()
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [isJoined, setIsJoined] = useState<boolean>(false)
    const [isMuted, setIsMuted] = useState<boolean>(false)
    const [volume, setVolume] = useState<number>(100)
    const [isVolumeUp, setIsVolumeUp] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isRatingVisible, setIsRatingVisible] = useState<boolean>(false)
    const [remoteUid, setRemoteUid] = useState(0)

    const [connectionData, setConnectionData] = useState<any>()
    const { getMeetingDetails } = useContext(AppContext)
    const { postRating } = useContext(PatientContext)
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['20%', '85%'], []);
    const { state } = useContext(AuthContext)
    const [user] = useState<IUser>(state.user)
    const navigation = useNavigation();

    const showMessage = (msg: string) => {
        setMessage(msg)
    }

    useEffect(() => {
        getMeetingDetails({ appointmentId: appointment_id, onSuccess: setConnectionData, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
    }, [])

    useEffect(() => {
        setupVoiceSDKEngine()
    })

    const setupVoiceSDKEngine = async () => {
        try {
            if (Platform.OS === 'android') { await requestAudioPermission() }

            agoraEngineRef.current = createAgoraRtcEngine()
            const agoraEngine = agoraEngineRef.current

            if (connectionData && connectionData.channel) {
                agoraEngine.registerEventHandler({
                    onJoinChannelSuccess: () => {
                        showMessage('Successfully joined the meeting channel ' + connectionData.channel)
                        setIsConnected(true)
                    },
                    onUserJoined: (_connection, Uid) => {
                        showMessage('Remote user joined with uid ' + Uid)
                        setRemoteUid(Uid)
                    },
                    onUserOffline: (_connection, Uid) => {
                        showMessage('Remote user left the channel. uid: ' + Uid)
                        setRemoteUid(0)
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
            setVolume(volume + 5);
        }
        toastShortMessage(volume.toString())
        agoraEngineRef.current?.adjustRecordingSignalVolume(volume);
    };

    const decreaseVolume = () => {
        if (volume !== 0) {
            setVolume(volume - 5);
        }
        toastShortMessage(volume.toString())
        agoraEngineRef.current?.adjustRecordingSignalVolume(volume);
    };

    const join = async () => {

        if (isConnected && isJoined) {
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
                                navigation.navigate('MyAppointments')
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
            if (connectionData && connectionData.appId) {
                agoraEngineRef.current?.joinChannel(connectionData.token, connectionData.channel, uid, {
                    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
                })
                setIsJoined(true)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const leave = () => {
        try {
            agoraEngineRef.current?.leaveChannel()
            setRemoteUid(0)
            setIsConnected(false)
            setIsJoined(false)
            showMessage('You left the channel')
        } catch (e) {
            console.log(e)
        }
    }

    const handleCloseRating = () => {
        setIsRatingVisible(false)
        leave()
        navigation.navigate('MyAppointments')
    }

    const handleRatingSubmit = (rating: number, comment: string) => {
        if (rating > 0) {
            const payload = {
                doctor_id: doctor_id,
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

    const renderBackDrop = useCallback((props: any) => (<BottomSheetBackdrop {...props} opacity={0.2} />), []);

    const handleSheetChanges = useCallback((index: number) => {
        bottomSheetRef.current?.snapToIndex(index)
    }, []);


    const muteCall = () => {
        console.log(`current mute value`, isMuted)
        setIsMuted(!isMuted)
        agoraEngineRef.current?.muteLocalAudioStream(isMuted);
    }

    const volumeUp = () => {
        console.log(`is volume up`, isVolumeUp)
        setIsVolumeUp(!isVolumeUp);
    }


    return (
        <React.Fragment>
            <SafeAreaView style={styles.main}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContainer}>
                    {isConnected ? (
                        <Text>Local user uid: {uid}</Text>
                    ) : (
                        <Text>Join a channel</Text>
                    )}
                    {isConnected && remoteUid !== 0 ? (
                        <Text>Remote user uid: {remoteUid}</Text>
                    ) : (
                        user.is_patient ?
                            <Text>Waiting for doctor to join</Text>
                            : <Text>Waiting for patient to join</Text>
                    )}
                    <Text>{message}</Text>
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
                        <CircularButton icon='volume-up' size={20} onPress={increaseVolume} iconColor={config.colors.gray} backgroundColor={isVolumeUp ? config.colors.silver : config.colors.white} btnStyle={{ marginTop: 20 }} />
                        <CircularButton icon='microphone-alt-slash' size={20} onPress={muteCall} iconColor={config.colors.gray} backgroundColor={isMuted ? config.colors.silver : config.colors.white} btnStyle={{ marginTop: 20 }} />
                        <CircularButton icon='phone-alt' size={20} onPress={join} btnStyle={{ marginTop: 20 }} />
                    </BottomSheetScrollView>
                </BottomSheet>
                <RateDoctorPopup visible={isRatingVisible} onClose={handleCloseRating} onRatingSubmit={handleRatingSubmit} />
            </SafeAreaView>
            {isLoading && <AppLoader />}
        </React.Fragment>
    )


}

export default AudioCallMeeting

const styles = StyleSheet.create({
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
    },
    scroll: {
        flex: 1,
        backgroundColor: '#ddeeff',
        width: '100%'
    },
    scrollContainer: {
        alignItems: 'center'
    },
    videoView: {
        width: '90%',
        height: 200
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
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
    contentContainer: {
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
})