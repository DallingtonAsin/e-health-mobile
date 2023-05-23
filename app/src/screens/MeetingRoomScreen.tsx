import React from 'react'
import VideoCallMeeting from './meetings/VideoCallMeeting'
import AudioCallMeeting from './meetings/AudioCallMeeting'
import { DoctorsDetail, IUser } from '../interfaces'

const MeetingRoomScreen = ({ appointment_id, doctor, patient, is_video, setVideoCall }: { appointment_id: number, doctor: DoctorsDetail, patient: IUser, is_video: boolean, setVideoCall: React.Dispatch<React.SetStateAction<boolean>> }) => {

  if (is_video) {
    return <VideoCallMeeting appointment_id={appointment_id} doctor_id={doctor.id} setVideoCall={setVideoCall} />
  } else {
    return <AudioCallMeeting appointment_id={appointment_id} doctor={doctor} patient={patient}/>
  }
}

export default MeetingRoomScreen