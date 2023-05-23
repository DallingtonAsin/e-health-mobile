import React, { useState, useEffect, useContext } from 'react'
import { View, Alert } from 'react-native'
import AgoraUIKit from 'agora-rn-uikit'
import AppLoader from '../../components/AppLoader'
import { createAgoraRtcEngine } from 'react-native-agora'
import { Context as AppContext } from '../../context/appContext'
import { Context as PatientContext } from '../../context/patientContext'
import { displayMessage } from '../../components/common/SharedHelper'
import RateDoctorPopup from '../../components/RateDoctorPopup'
import { Context as AuthContext } from '../../context/authContext'
import { IUser } from '../../interfaces'

const VideoCallMeeting = ({ appointment_id, doctor_id, setVideoCall }: { appointment_id: number, doctor_id: number, setVideoCall: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const { postRating } = useContext(PatientContext)
    const { state } = useContext(AuthContext)
    const [user] = useState<IUser>(state.user)
    const [connectionData, setConnectionData] = useState<any>()
    const { getMeetingDetails } = useContext(AppContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isRatingVisible, setIsRatingVisible] = useState(false)
    const agoraEngine = createAgoraRtcEngine()

    useEffect(() => {
        console.log(`Video setup...`)
        getMeetingDetails({ appointmentId: appointment_id, onSuccess: populateConnectionData, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })

        if (connectionData && connectionData.appId) {
            agoraEngine.initialize({
                appId: connectionData.appId
            })
        }
    }, [])


    const handleCloseRating = () => {
        setIsRatingVisible(false)
        setVideoCall(false)
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
                    setVideoCall(false)
                }
            })

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
                                setIsRatingVisible(true)
                            } else {
                                setVideoCall(false)
                            }
                        }
                    },
                ],
                { cancelable: false }
            )

        },
    }

    const populateConnectionData = (data: any) => {
        console.log(`connection data`, data)
        setConnectionData(data)
    }

    if (isLoading) {
        return <AppLoader />
    }

    return (
        <React.Fragment>
            <View style={{flex:1}}>
            <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
            <RateDoctorPopup visible={isRatingVisible} onClose={handleCloseRating} onRatingSubmit={handleRatingSubmit} />
            </View>
        </React.Fragment>
    )
}

export default VideoCallMeeting