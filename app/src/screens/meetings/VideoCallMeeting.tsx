import React, { useState, useEffect, useContext } from 'react'
import { ScrollView, StyleSheet, Text, Alert, View } from 'react-native'
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

const VideoCallMeeting = ({ appointment_id }: { appointment_id: number }) => {

    const { postRating } = useContext(PatientContext)
    const { state } = useContext(AuthContext)
    const [user] = useState<IUser>(state.user)
    const [connectionData, setConnectionData] = useState<any>()
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
        EndCall: () => {
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
                                setVideoCall(false)
                                stopTimer()
                            }
                        }
                    },
                ],
                { cancelable: false }
            )

        },
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
        setVideoCall(true)
    }

    if (isLoading) {
        return <AppLoader />
    }

    return (
        <React.Fragment>
            <View style={{ flex: 1 }}>
                {videoCall ? (<AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
                ) : (

                    <>
                        <View style={styles.main}>
                            <ScrollView
                                contentContainerStyle={styles.scrollContainer}>

                                <View style={styles.centeredContent}>
                                    {user.is_patient && (doctor.thumbnail && <Avatar size={95} source={doctor.thumbnail} />)}
                                    {!user.is_patient && (patient.thumbnail && <Avatar size={95} source={patient.thumbnail} />)}

                                    {user.is_patient && !doctor.thumbnail && <AvatarRP.Text size={95} label={getUserInitials(`${doctor.first_name} ${doctor.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.2, borderColor: config.colors.gray }]} />}
                                    {!user.is_patient && !patient.thumbnail && <AvatarRP.Text size={95} label={getUserInitials(`${patient.first_name} ${patient.last_name}`)} style={[config.styles.userAvatar, { borderWidth: 0.2, borderColor: config.colors.gray }]} />}

                                    {!videoCall && <Text>Start video call with
                                        {user.is_patient && <Text style={styles.name}> {doctor.first_name}</Text>}
                                        {!user.is_patient && <Text style={styles.name}> {patient.first_name}</Text>}
                                    </Text>}

                                    <TimerScreen timer={timer} />
                                </View>
                                <BottomRightButton icon={"video"} size={20} onPress={() => startCall()} />

                            </ScrollView>
                        </View>
                    </>
                )
                }
                <RateDoctorPopup visible={isRatingVisible} onClose={handleCloseRating} onRatingSubmit={handleRatingSubmit} />
            </View>
        </React.Fragment>
    )
}

export default VideoCallMeeting

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
        // color: config.colors.dark
    }

})