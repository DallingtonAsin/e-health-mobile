import React from 'react'
import VideoCallMeeting from './meetings/VideoCallMeeting'
import AudioCallMeeting from './meetings/AudioCallMeeting'
import { DoctorsDetail, IUser } from '../interfaces'

const MeetingRoomScreen = ({ appointment_id, doctor, patient, videoCall, setVideoCall }: { appointment_id: number, doctor: DoctorsDetail, patient: IUser, videoCall: boolean, setVideoCall: React.Dispatch<React.SetStateAction<boolean>> }) => {

  if (videoCall) {
    return <VideoCallMeeting appointment_id={appointment_id} doctor_id={doctor.id} setVideoCall={setVideoCall} />
  } else {
    return <AudioCallMeeting appointment_id={appointment_id} doctor={doctor} patient={patient}/>
  }
}

export default MeetingRoomScreen