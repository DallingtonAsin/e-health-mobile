import React, { useState, useEffect, useContext } from 'react'
import { View, Button, Alert, PermissionsAndroid, Platform } from 'react-native'
import AgoraUIKit from 'agora-rn-uikit'
import AppLoader from '../components/AppLoader'
import RtcEngine, { createAgoraRtcEngine } from 'react-native-agora'
import { Context as AppContext } from '../context/appContext'
import { Context as PatientContext } from '../context/patientContext'
import { displayMessage } from '../components/common/SharedHelper'
import RateDoctorPopup from '../components/RateDoctorPopup'
import { Context as AuthContext } from '../context/authContext'
import { IUser } from '../interfaces'

const MeetingRoomScreen = ({ appointment_id, doctor_id, videoCall, setVideoCall }: { appointment_id: number, doctor_id: number, videoCall: boolean, setVideoCall: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const { postRating } = useContext(PatientContext)
  const { state, updateUserState } = useContext(AuthContext)
  const [user, setUser] = useState<IUser>(state.user)
  const [connectionData, setConnectionData] = useState<any>()
  const [rtcEngine, setRtcEngine] = useState<typeof RtcEngine | null>(null)
  const [channelName, setChannelName] = useState('')
  const { getMeetingDetails } = useContext(AppContext)
  const [isLoading, setIsLoading] = useState(true)
  const [isRatingVisible, setIsRatingVisible] = useState(false)
  const agoraEngine = createAgoraRtcEngine()

  useEffect(() => {

    getMeetingDetails({ appointmentId: appointment_id, onSuccess: populateConnectionData, onFailure: displayMessage, onCompletion: () => { setIsLoading(false) } })

    if (connectionData && connectionData.appId) {
      agoraEngine.initialize({
        appId: connectionData.appId
      })

      agoraEngine.enableVideo()
      agoraEngine.enableAudio()
      agoraEngine.joinChannel(connectionData.appId, 'Telecmedicine', 778788, {})

    }

    return () => {
      // Clean up resources
      // agoraEngine?.destroy()
    }
  }, [])

  const handleRateDoctor = () => {
    setIsRatingVisible(true)
  }

  const handleCloseRating = () => {
    setIsRatingVisible(false)
  }

  const handleRatingSubmit = (rating: number) => {
    if (rating > 0) {
      const payload = {
        doctor_id: doctor_id,
        rating: rating,
        comment: null
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
        'Are you sure you want to hang up the call?',
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
    setConnectionData(data)
  }

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ])
    }
  }

  if (isLoading) {
    return <AppLoader />
  }

  if (videoCall) {
    return (
      <>
        <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
        <RateDoctorPopup visible={isRatingVisible} onClose={handleCloseRating} onRatingSubmit={handleRatingSubmit} />
      </>
    )
  } else {
    return null
  }
}

export default MeetingRoomScreen