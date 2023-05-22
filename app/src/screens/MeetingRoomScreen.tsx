import React from 'react'
import VideoCallMeeting from './meetings/VideoCallMeeting'
import AudioCallMeeting from './meetings/AudioCallMeeting'

const MeetingRoomScreen = ({ appointment_id, doctor_id, videoCall, setVideoCall }: { appointment_id: number, doctor_id: number, videoCall: boolean, setVideoCall: React.Dispatch<React.SetStateAction<boolean>> }) => {

  if (videoCall) {
    return <VideoCallMeeting appointment_id={appointment_id} doctor_id={doctor_id} setVideoCall={setVideoCall} />
  } else {
    return <AudioCallMeeting appointment_id={appointment_id} />
  }
}

export default MeetingRoomScreen