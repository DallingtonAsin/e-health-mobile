import React, { useState, useEffect, useContext } from 'react'
import { ScrollView, StyleSheet, Text, Alert, View} from 'react-native'
import AgoraUIKit from 'agora-rn-uikit'
import AppLoader from '../../components/AppLoader'
import { createAgoraRtcEngine } from 'react-native-agora'
import { Context as AppContext } from '../../context/appContext'
import { Context as PatientContext } from '../../context/patientContext'
import { displayMessage, getUserInitials } from '../../components/common/SharedHelper'
import RateDoctorPopup from '../../components/RateDoctorPopup'
import { Context as AuthContext } from '../../context/authContext'
import { IUser } from '../../interfaces'
import { BottomRightButton } from '../../components/common/buttons'
import TimerScreen from '../../components/common/TimerScreen'
import { Avatar as AvatarRP } from 'react-native-paper';
import Avatar from '../../components/Avatar';
import * as config from '../../configs'
import { agoraConnectionInitialState } from '../../configs/constants'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'

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
    const [seconds, setSeconds] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [isJoined, setIsJoined] = useState(false)
    const [isOtherUserJoined, setIsOtherUserJoined] = useState(false);

    useEffect(() => {
        getMeetingDetails({ appointmentId: appointment_id, onSuccess: setMeetingDetails, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })
        if (connectionData && connectionData.appId) {
            agoraEngine.initialize({
                appId: connectionData.appId
            })
        }
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

    const handleCloseRating = () => {
        setIsRatingVisible(false)
        setVideoCall(false)
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
                        setVideoCall(false)
                    }
                })
            } else {
                displayMessage(`Unable to process request: no doc id`)
            }
        } else {
            displayMessage(`Rate doctor with atleast one star`)
        }
    }

    const rtcCallbacks = {

        JoinChannelSuccess: () => {
            console.log(`Joined my channel xxx`)
            setIsJoined(true)
        },

        UserJoined: (data: any) => {
            if (data.localUid) {
                setIsOtherUserJoined(true);
            }
            console.log(`user joined channel xxxx...`, data)
        },

        UserOffline: (data: any) => {
            console.log(`user offline channel xxxx...`, data)
            setIsOtherUserJoined(false);
        },

        LeaveChannel: () => {
            console.log(`Left the channel`)
        },

        EndCall: () => {
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
                                setVideoCall(false)
                                pauseTimer()
                            }
                        }
                    },
                ],
                { cancelable: false }
            )

        },
    }

  
    useEffect(() => {
        let interval: any = null;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive]);

    const startTimer= () => {
        setIsActive(true);
      };
    
      const pauseTimer = () => {
        setIsActive(false);
      };
    
      const stopTimer = () => {
        setIsActive(false);
        setSeconds(0);
      };



    const startCall = () => {
        startTimer()
        setVideoCall(true)
    }

    if (isLoading) {
        return <AppLoader />
    }

    return (
        <React.Fragment>
            <View style={{ flex: 1 }}>
                {videoCall ? (
                    <View style={styles.container}>
                        {isJoined && !isOtherUserJoined && <View style={styles.header}>
                            <Animatable.Text animation="pulse" iterationCount={"infinite"} easing="ease-out" style={styles.info}><Icon name="info-circle" size={18} color={config.colors.primaryBlue} /> You are the only one here</Animatable.Text >
                        </View>}
                        <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
                    </View>
                ) : (
                    <View style={styles.main}>
                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            <View style={styles.centeredContent}>
                                {user.is_patient && (doctor && doctor.thumbnail && <Avatar size={95} source={doctor.thumbnail} />)}
                                {!user.is_patient && (patient && patient.thumbnail && <Avatar size={95} source={patient.thumbnail} />)}

                                {user.is_patient && doctor && !doctor.thumbnail && <AvatarRP.Text size={95} label={getUserInitials(`${doctor.first_name} ${doctor.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.2, borderColor: config.colors.gray }]} />}
                                {!user.is_patient && patient && !patient.thumbnail && <AvatarRP.Text size={95} label={getUserInitials(`${patient.first_name} ${patient.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.2, borderColor: config.colors.gray }]} />}

                                {!videoCall && <Text>Start video call with
                                    {user.is_patient && doctor && <Text> {doctor.first_name}</Text>}
                                    {!user.is_patient && patient && <Text> {patient.first_name}</Text>}
                                </Text>}
                                <TimerScreen seconds={seconds} />
                            </View>
                        </ScrollView>
                        <View style={styles.controls}>
                            <BottomRightButton icon={"video"} size={20} btnStyle={{ right: 8 }} onPress={() => startCall()} />
                            <Text style={styles.controlText}>{videoCall ? 'Stop video' : 'Start video'}</Text>
                        </View>
                    </View>
                )
                }
                <RateDoctorPopup visible={isRatingVisible} onClose={handleCloseRating} onRatingSubmit={handleRatingSubmit} />
            </View>
        </React.Fragment>
    )
}

export default VideoCallMeeting

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: config.colors.white,
    },

    header: {
        height: 30,
        backgroundColor: config.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },

    body: {
        flex: 1,
        backgroundColor: config.colors.white,
        height: '100%'
    },

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

    controls: {
        alignItems: 'center',
        bottom: 25
    },

    controlText: {
        textAlign: 'center',
        textTransform: 'lowercase',
        fontSize: config.fonts.medium
    },

    infoText: {
        textAlign: 'center',
        fontSize: config.fonts.medium,

    },

    info: {
        color: config.colors.primaryBlue,
        textAlign: 'center',
        fontSize: config.fonts.medium,
    },

})